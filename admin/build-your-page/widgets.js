// $Id$

var border_width = 3;
var border_style = "solid "+border_width+"px";

var codeURI = ".";
codeURI = codeURI.substring( 0, codeURI.lastIndexOf( "/" ) );
var temp_debug_w = "95%";
var temp_debug_h = "95%";

function getsize( o ) {
  return { w: sz(o.style.width), h: sz(o.style.height) };
}

function getx( o ) {
  return sz( o.style.left );
}

function gety( o ) {
  return sz( o.style.top );
}

function width( o ) {
  return sz( o.style.width );
}

function height( o ) {
  return sz( o.style.height );
}

function getpos( o ) {
  return { x: sz(o.style.left), y: sz(o.style.top) };
}

function setsize( o, w, h ) {
  sty( o, "width", w, "height", h );
}

function setpos( o, x, y ) {
  sty( o, "left", x, "top", y );
}

function setrb( o, r, b ) {
  sty( o,
    "right", r,
    "bottom", b );
}

function index_of( a, e ) {
  for (var i=0; i<a.length; ++i) {
    if (a[i] == e) {
      return i;
    }
  }
  return undefined;
}

function remove_element( a, e ) {
  var i = index_of( a, e );
  if (i != undefined) {
    a.splice( i, 1 );
  }
}

function isa( o, claz ) {
  return claz["prototype"] != undefined && claz.prototype.isPrototypeOf( o );
}

function sz( v ) {
  if (typeof( v )=="string" && v.substr( v.length-2 ) == "px") {
    v = v.substr( 0, v.length-2 );
  }
  if (v=="") {
    v = 0;
  }
  return parseInt( v );
}

function div() {
  var d = elem_make_element( "div", arguments );
  return d;
}

function elem_make_element( tag, contents ) {
  var p = document.createElement( tag );
  for (var i=0; i<contents.length; ++i) {
    var o = contents[i];
    o = to_node( o );
    p.appendChild( o );
  }
  return p;
}

function elem( tag ) {
  return document.createElement( tag );
}

function textNode( s ) {
  return document.createTextNode( s );
}

function stack_trace() {
  var a = arguments.caller;
  var s = "";
  while (a != null) {
    var fun = a.callee;
    fun = fun.toString();
    var matches = fun.match( /function\s+(\w+)/ );
    var name;
    if (matches) {
      var name = matches[1];
    } else {
      if (fun.match( /function\s*\(/ )) {
        name = "[closure]";
      } else {
        name = "??? "+fun;
      }
    }
    s += name+"\n";
    a = a.caller;
  }
  return s;
}

var shew_container = null;

function shew_get_container() {
  var container = shew_container;
  if (container==null) {
    var d = window.document.createElement( "pre" );
    d.style.cssText = "border:solid;background-color:#e8e8e8;padding:4;font-family:monospace; font-size: 75%";
    d.style.position = "absolute";
    d.style.right = "8";
    d.style.top = "8";
    var body = document.getElementsByTagName( "body" )[0];
    if (body == undefined)  {
      return undefined;
    }
    body.appendChild( d );
    shew_container = container = d;
  }
  return container;
}

function shew_scroll_container() {
  var c = shew_get_container();

  if (c == undefined) {
    return;
  }

  if (c.scrollTop < c.scrollHeight) {
    c.scrollTop = c.scrollHeight;
  }
}

function disp( o ) {
  var c = shew_get_container();

  if (c == undefined) {
    return;
  }

  c.appendChild( pre_ize( o ) );
  shew_scroll_container();
}

function to_node( o ) {
  if (o==undefined) {
    o = "[undefined]";
  }

  //                     This is to handle a strange case where
  //                     we have a Text that's not a node.
  if (top["Node"] && !isa( o, Node ) && o.constructor != "[Text]") {
    if (typeof( o )!="string" && typeof( o )!="number") {
      o = o+"";
    }
    if (o==="") {
      o = document.createElement( "br" );
    } else {
      o = top.document.createTextNode( o+"" );
    }
  } else {
    o = top.document.createTextNode( o+"" );
  }
  return o;
}

function node_to_html( node ) {
  if (isa( node, HTMLDocument )) {
    return node_to_html( node.documentElement );
  } else if (node.innerHTML) {
    return node.innerHTML;
  } else {
    node = node.cloneNode( true );
    var div = document.createElement( "div" );
    div.appendChild( node );
    return div.innerHTML;
  }
}

function shew_expose( o ) {
  if (top["Node"] && isa( o, Node )) {
    o = node_to_html( o );
    o = o.replace( />/g, ">\n" );
  }

  o = to_node( o );

  return o;
}

function shew( o ) {
  for (var i=0; i<arguments.length; ++i) {
    var o = arguments[i];

    if (o === undefined) {
      o = "[undefined]";
    }
    shew_last = o;

    disp( shew_expose( o ) );
  }
}

function pre_ize( n ) {
  if (typeof( n )=="string") {
    n = top.document.createTextNode( n );
  } else if (n["data"] != undefined) {
    n = n.data;
  }
  return div( n );
}

function shew_exception( e ) {
  var s = "";
  if (e["type"]) { s += e["type"]+"; "; }
  if (e["message"]) { s += e["message"]+"; "; }
  if (e["description"]) { s += e["description"]+"; "; }
  if (e["number"]) { s += e["number"]+"; "; }
  if (e["stack"]) { s += e["stack"]+"; "; }
  shew( s );
}

window.onerror = function( a, b, c ) {
  var message =  "Exception: "+a+" "+b+" "+c;
  shew( message );
  return true;
};

function spiff_handler( eh ) {
  return function( e ) {
    try {
      if (window.event) {
        e = window.event;
      }
      if (!e.target) {
        e.target = e.srcElement;
      }

      return eh( e );
    } catch( e ) {
      shew_exception( e );
      shew( stack_trace() );
      throw e;
    }
  };
}

function chain_handler( o, handler_name, new_handler ) {
  var h;

  if (o[handler_name] != undefined) {
    var old_handler = o[handler_name];
    h = function( e ) {
      new_handler( e );
      old_handler( e );
    };
  } else {
    h = new_handler;
  }
  o[handler_name] = h;
}

function install_mouse_handlers_into_target( target, onmouse ) {
  var original_handlers = {
  up: target.onmouseup,
  down: target.onmousedown,
  move: target.onmousemove
  };

  target.onmouseup = onmouse.up;
  target.onmousedown = onmouse.down;
  target.onmousemove = onmouse.move;

  return {
  restore: function() {
      target.onmouseup = original_handlers.up;
      target.onmousedown = original_handlers.down;
      target.onmousemove = original_handlers.move;
    }
  };
}

function install_mouse_handlers_until_mouseup( target, onmouse ) {
  var restorer;

  var orig_up = onmouse.up;
  onmouse.up = function( e ) {
    restorer.restore();
    return orig_up( e );
  };

  restorer = install_mouse_handlers_into_target( target, onmouse );
}

function install_onmouse_installer_onclick( target, onmouse ) {
  target.onmousedown = function() {
    install_mouse_handlers_until_mouseup( document, onmouse );
    return false;
  };
}

function install_cnd_installer_onclick( target, cnd ) {
  install_onmouse_installer_onclick( target, cnd_to_onmouse( cnd ) );
}

var shew_onmouse = {
 up: function( e ) { shew( "up   "+e.clientX+","+e.clientY ); },
 down: function( e ) { shew( "down "+e.clientX+","+e.clientY ); },
 move: function( e ) { shew( "move "+e.clientX+","+e.clientY ); },
};

function make_cnd( start, drag, stop ) {
  if (!start) {
    start = function() {};
  }
  if (!drag) {
    drag = function( x, y ) {};
  }
  if (!stop) {
    stop = function() {};
  }

  return { start: start, drag: drag, stop: stop };
}

function cnd_to_onmouse( cnd ) {
  return {
  down: function( e ) { cnd.start(); },
      move: function( e ) { cnd.drag( e.clientX, e.clientY ); },
      up: function( e ) { cnd.stop(); },
      };
}

function compose_cnds( a, b ) {
  return make_cnd( function() { a.start(); b.start(); },
                   function( x, y ) { a.drag( x, y ); b.drag( x, y ); },
                   function() { a.stop(); b.stop(); } );
}

var shew_cnd = {
 start:  function() { shew( "start" ); },
 drag:  function( x, y ) { shew( "drag "+x+" "+y ); },
 stop:  function() { shew( "stop" ); },
};

function move_element_cnd( elem ) {
  var yet = false;
  var dx, dy;

  return make_cnd(
                  function() { yet = false; },
                  function( x, y ) {
                    if (!yet) {
                      dx = sz( elem.style.left ) - x;
                      dy = sz( elem.style.top ) - y;
                      yet = true;
                    }
                    setpos( elem, x+dx, y+dy );
                  },
                  null);
}

function resize_element_cnd( elem ) {
  var yet = false;
  var dx, dy;

  return make_cnd(
    function( x, y ) {
      yet = false;
    },
    function( x, y ) {
      if (!yet) {
        dx = width( elem ) - x;
        dy = height( elem ) - y;
        yet = true;
      }
      setsize( elem, x + dx, y + dy );
    },
    null);
}

function sty() {
  var o = arguments[0];
  for (var i=1; i<arguments.length; i+=2) {
    var k = arguments[i];
    var v = arguments[i+1];
    o.style.setProperty( k, v, "" );
  }

  return o;
}

function tobody( n ) {
  var bodies = document.getElementsByTagName( "body" );
  var body = bodies[0];
  body.appendChild( n );
}

function create_img( url ) {
  var img = document.createElement( "img" );
  img.src = url;
  return img;
}

function create_icon( text, url, cb ) {
  var img = create_img( url );
  img.onmousedown = function( e ) {
    cb();
    e.cancelBubble = true;
    e.stopPropagation();
    return false;
  };
  sty( img, "padding", "3px" );
  img.title = text;
  return img;
}

function Box() {
  var self = elem( "div" );
  sty( self, "border", "none" );
  sty( self, "padding", "0" );

  self.set = function( n ) {
    if (this.get() == n) {
      return;
    }

    while (self.childNodes.length > 0) {
      self.removeChild( self.childNodes[0] );
    }
    self.appendChild( n );
  };

  self.get = function() {
    return self.childNodes[0];
  };

  return self;
}

function text_style( n ) {
  sty( n, "font-family", "courier" );
  sty( n, "font-size", "24px" );
}

function set_onblur( o, handler ) {
  if (o.addEventListener != undefined) {
    o.addEventListener( "blur", handler, false );
  } else if (o.attachEvent != undefined) {
    o.attachEvent( "onblur", handler );
  } else {
    shew( "Error: unable to add onblur handler." );
  }
}

// cb is called when editing is completed.
function EditText( text ) {
  if (text == undefined) {
    text = "";
  }

  var self = Box();
  self.shower = elem( "div" );
  self.shower.text = textNode( "" );
  self.shower.appendChild( self.shower.text );
  self.editor = elem( "textarea" );
  self.editor.wrap = "soft";

  sty( self.shower, "padding", "2px" );
  setsize( self.shower, "100%", "100%" );
  setsize( self.editor, "100%", "100%" );
  setsize( self, "100%", "100%" );

  text_style( self.shower );
  text_style( self.editor );

  set_onblur( self.editor,
    spiff_handler( function() {
        self.show();
      } ) );

  self.editor.onkeypress = spiff_handler( function( e ) {
    if (e.keyCode==13) {
      self.show();
    }
  } );

  self.show = function() {
    self.shower.text.data = self.editor.value;
    self.set( self.shower );

    self.editor.onblur = null;
  };

  self.edit = function() {
    self.editor.value = self.shower.text.data;
    self.set( self.editor );
    self.editor.focus();
  };

  self.show();

  self.showDecorations = function() {
    self.wrapper.showTitlebar();
    self.wrapper.showResizer();
  };

  self.hideDecorations = function() {
    self.wrapper.hideTitlebar();
    self.wrapper.hideResizer();
  };

  self.serialize = function() {
    return { text: self.shower.text.data };
  };

  self.unserialize = function( o ) {
    self.shower.text.data = o.text;
  }

  self.shower.text.data = text;
  self.editor.value = text;

  self.widget_type = "EditText";

  return self;
}

function Image( url ) {
  var self = elem( "img" );
  self.src = url;
  setsize( self, "100%", "100%" );

  self.onmousedown = function() { shew( 'icon' ); return false; };

  self.edit = function() {
    shew( "Cannot edit this widget." );
  };

  self.showDecorations = function() {
    self.wrapper.showTitlebar();
    self.wrapper.showResizer();
  };

  self.hideDecorations = function() {
    self.wrapper.hideTitlebar();
    self.wrapper.hideResizer();
  };

  self.serialize = function() {
    return { url: self.src };
  };

  self.unserialize = function( o ) {
    self.src = o.url;
  };

  self.widget_type = "Image";

  return self;
}

function get_widgets_container() {
  var sc = document.getElementById( "widgetsContainer" );
  if (sc == null) {
    sc = elem( "div" );
    sc.id = "widgetsContainer";
    sty( sc, "position", "absolute", "" );
    setpos( sc, 0, 0 );
    setsize( sc, 0, 0 );
    tobody( sc );
  }
  return sc;
}

function main() {
  try {
    go();
  } catch( e ) {
    shew_exception( e );
    throw e;
  }
}

function create_titlebar( widget ) {
  var titlebar_height = 40;

  widget.titlebar = elem( "div" );
  setsize( widget.titlebar, "100%", "" );
  sty( widget.titlebar,
    "background-color", "#ddd",
    "position", "absolute",
    "border", border_style );
  setpos( widget.titlebar, -border_width, -titlebar_height-border_width*2 );

  var close_icon = 
    create_icon( "close", "i/close.gif",
      function() {
        widget.close();
      } );

  sty( close_icon, "position", "absolute" );
  setpos( close_icon, -38, -38 );

  widget.appendChild( close_icon );

  widget.showTitlebar =
    function() { sty( close_icon, "visibility", "visible" ); };
  widget.hideTitlebar =
    function() { sty( close_icon, "visibility", "hidden" ); };

  widget.hideTitlebar();
}

function create_resizer( widget ) {
  var resizer_size = 40;

  widget.resizer = elem( "div" );
  setrb( widget.resizer, -38, -38 );
  sty( widget.resizer, "position", "absolute" );

  var resize_icon = 
    create_icon( "resize", "i/resize.gif",
      function( e ) {
        shew( "nu "+e );
      } );
  widget.resizer.appendChild( resize_icon );

  widget.appendChild( widget.resizer );

  install_cnd_installer_onclick( resize_icon, resize_element_cnd( widget ) );

  widget.showResizer =
    function() { sty( widget.resizer, "visibility", "visible" ); };
  widget.hideResizer =
    function() { sty( widget.resizer, "visibility", "hidden" ); };

  widget.hideResizer();
}

var last_activated = undefined;
function therecanbeonlyoneactivated( wrapper ) {
  if (last_activated == wrapper) {
    return;
  }

  if (last_activated != undefined) {
    last_activated.deactivate();
  }
  last_activated = wrapper;
  wrapper.activate();
}

function wrap_widget( widget, x, y ) {
  var self = elem( "div" );

  widget.wrapper = self;

  sty( self,
    "position", "absolute",
    "background-color", "#f0f0f0",
    "padding", "3",
    "text-align", "left",
    "padding", 0 );
  setpos( self, x, y );
  setsize( self, 200, 200 );

  self.widget = widget;
  self.appendChild( self.widget );

  self.close = function() {
    self.parentNode.removeChild( self );
    forget_widget( self );
  };

  create_titlebar( self );
  create_resizer( self );

  widget.id = "foop";

  install_cnd_installer_onclick( self.widget, move_element_cnd( self ) );
  chain_handler( self, "onmousedown", function() { therecanbeonlyoneactivated( self ); } );

  widget.ondblclick = function() { widget.edit(); };

  self.activate = function() {
    widget.showDecorations();
    self.show_border();
    setpos( self, getx( self )-3, gety( self )-3 );
  };

  self.deactivate = function() {
    widget.hideDecorations();
    self.hide_border();
    setpos( self, getx( self )+3, gety( self )+3 );
  };

  self.show_border = function() {
    sty( self, "border", border_style );
  };

  self.hide_border = function() {
    sty( self, "border", "none" );
  };

  self.serialize = function() {
    return {
      type: widget.widget_type,
      widget: widget.serialize(),
      pos: { x: getx( self ), y: gety( self ) },
      size: { x: width( self ), y: height( self ) }
    };
  }

  get_widgets_container().appendChild( self );

  remember_widget( self );

  return self;
}

var new_widget_linkee_last_x = 80;
var new_widget_linkee_last_y = 160;
function place_new_widget( widget ) {
  var w = wrap_widget( widget, new_widget_linkee_last_x, new_widget_linkee_last_y );
  new_widget_linkee_last_x += 10;
  new_widget_linkee_last_y += 10;
  therecanbeonlyoneactivated( w );
  return w;
}

function get_drop_image() {
  var drop_image = document.getElementById( "drop_image" );
  var url = drop_image.value;
  drop_image.value = "";
  return place_new_widget( new Image( url ) )
}

function get_drop_text() {
  var drop_text = document.getElementById( "drop_text" );
  var text = drop_text.value;
  drop_text.value = "";
  return place_new_widget( new EditText( text ) )
}

var all_widgets = new Array();
function remember_widget( widget ) {
  all_widgets.push( widget );
}

function forget_widget( widget ) {
  remove_element( all_widgets, widget );
}

function remove_all_widgets() {
  while (all_widgets.length > 0) {
    var w = all_widgets.pop();
    w.close();
  }
}

function gather() {
  var ws = new Array();
  for (var i=0; i<all_widgets.length; ++i) {
    ws.push( all_widgets[i].serialize() );
  }
  return ws;
}

function save() {
  var s = gather();
  s = s.toSource();
  s = "var q = "+s+"; q";
  var hostname = document.location.hostname;
  globalStorage[hostname]['stuff'] = s;
}

function load() {
  var hostname = document.location.hostname;

  if (globalStorage[hostname]['stuff'] == undefined ||
    globalStorage[hostname]['stuff'].value == undefined) {
    return;
  }

  var ser = globalStorage[hostname]['stuff'].value;
  var s = eval( ser );

  remove_all_widgets();

  for (var i=0; i<s.length; ++i) {
    var widget = s[i];
    var type = widget.type;
    var w = eval( "new "+type+"()" );
    w.unserialize( widget.widget );
    w = place_new_widget( w );

    setpos( w, widget.pos.x, widget.pos.y );
    setsize( w, widget.size.x, widget.size.y );
  }
}

function go() {
  load();
}
