/*
jQuery.Qeditor
==============

This is a simple WYSIWYG editor with jQuery.

## Author:

    Jason Lee <huacnlee@gmail.com>

## Requirements:

    [jQuery](http://jquery.com)
    (Font-Awesome)[http://fortawesome.github.io/Font-Awesome/] - Toolbar icons

## Usage:

    $("textarea").qeditor();

and then you need filt the html tags,attributes in you content page.
In Rails application, you can use like this:

    <%= sanitize(@post.body,:tags => %w(strong b i u strike ol ul li address blockquote pre code br div p), :attributes => %w(src)) %>
*/

var QEDITOR_ALLOW_TAGS_ON_PASTE, QEDITOR_DISABLE_ATTRIBUTES_ON_PASTE, QEDITOR_TOOLBAR_HTML;

QEDITOR_TOOLBAR_HTML = "<div class=\"qeditor_toolbar\">\n  <a href=\"#\" onclick=\"return QEditor.action(this,'bold');\" title=\"Bold\"><span class=\"icon-bold\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'italic');\" title=\"Italic\"><span class=\"icon-italic\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'underline');\" title=\"Underline\"><span class=\"icon-underline\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'strikethrough');\" title=\"StrikeThrough\"><span class=\"icon-strikethrough\"></span></a>		 \n  <span class=\"vline\"></span> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'insertorderedlist');\"><span class=\"icon-list-ol\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'insertunorderedlist');\"><span class=\"icon-list-ul\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'indent')\"><span class=\"icon-indent-left\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'outdent')\"><span class=\"icon-indent-right\"></span></a> \n  <span class=\"vline\"></span> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'insertHorizontalRule');\"><span class=\"icon-minus\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'formatBlock','blockquote');\"><span class=\"icon-quote-left\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'formatBlock','PRE');\"><span class=\"icon-code\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'createLink');\"><span class=\"icon-link\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.action(this,'insertimage');\"><span class=\"icon-picture\"></span></a> \n  <a href=\"#\" onclick=\"return QEditor.toggleFullScreen(this);\" class=\"pull-right\"><span class=\"icon-fullscreen\"></span></a> \n</div>";

QEDITOR_ALLOW_TAGS_ON_PASTE = "div,p,ul,ol,li,hr,br,b,strong,i,em,img,h2,h3,h4,h5,h6,h7";

QEDITOR_DISABLE_ATTRIBUTES_ON_PASTE = ["style", "class", "id", "name", "width", "height"];

window.QEditor = {
  action: function(el, a, p) {
    var editor;

    editor = $(".qeditor_preview", $(el).parent().parent());
    editor.focus();
    if (p === null) {
      p = false;
    }
    if (a === "createLink") {
      p = prompt("Type URL:");
      if (p.trim().length === 0) {
        return false;
      }
    } else if (a === "insertimage") {
      p = prompt("Image URL:");
      if (p.trim().length === 0) {
        return false;
      }
    }
    document.execCommand(a, false, p);
    if (editor !== void 0) {
      editor.change();
    }
    return false;
  },
  prompt: function(title) {
    var val;

    val = prompt(title);
    if (val) {
      return val;
    } else {
      return false;
    }
  },
  toggleFullScreen: function(el) {
    var editor;

    editor = $(el).parent().parent();
    if (editor.data("qe-fullscreen") === "1") {
      editor.css("width", editor.data("qe-width")).css("height", editor.data("qe-height")).css("top", editor.data("qe-top")).css("left", editor.data("qe-left")).css("position", "static").css("z-index", 0).data("qe-fullscreen", "0");
    } else {
      editor.data("qe-width", editor.width()).data("qe-height", editor.height()).data("qe-top", editor.position().top).data("qe-left", editor.position().left).data("qe-fullscreen", "1").css("top", 0).css("left", 0).css("position", "absolute").css("z-index", 99999).css("width", $(window).width()).css("height", $(window).height());
    }
    return false;
  },
  renderToolbar: function(el) {
    return el.parent().prepend(QEDITOR_TOOLBAR_HTML);
  },
  version: function() {
    return "0.1.0";
  }
};

(function($) {
  return $.fn.qeditor = function(options) {
    if (options === false) {
      return this.each(function() {
        var obj;

        obj = $(this);
        obj.parent().find('.qeditor_toolbar').detach();
        obj.parent().find('.qeditor_preview').detach();
        return obj.unwrap();
      });
    } else {
      return this.each(function() {
        var currentVal, editor, hidden_flag, obj;

        obj = $(this);
        obj.addClass("qeditor");
        if (options && options["mobile"]) {
          hidden_flag = $('<input type="hidden" name="did_editor_content_formatted" value="no">');
          obj.after(hidden_flag);
        } else {
          editor = $('<div class="qeditor_preview clearfix" style="overflow:scroll;" contentEditable="true"></div>');
          document.execCommand('defaultParagraphSeparator', false, 'p');
          currentVal = obj.val();
          editor.html(currentVal);
          editor.addClass(obj.attr("class"));
          obj.after(editor);
          editor.change(function() {
            var pobj, t;

            pobj = $(this);
            t = pobj.parent().find('.qeditor');
            return t.val(pobj.html());
          });
          editor.on("paste", function() {
            var txt;

            txt = $(this);
            return setTimeout(function() {
              var attrName, els, _i, _len;

              els = txt.find("*");
              for (_i = 0, _len = QEDITOR_DISABLE_ATTRIBUTES_ON_PASTE.length; _i < _len; _i++) {
                attrName = QEDITOR_DISABLE_ATTRIBUTES_ON_PASTE[_i];
                els.removeAttr(attrName);
              }
              return els.find(":not(" + QEDITOR_ALLOW_TAGS_ON_PASTE(+")")).contents().unwrap();
            }, 100);
          });
          editor.keyup(function() {
            return $(this).change();
          });
          editor.on("click", function(e) {
            return e.stopPropagation();
          });
          obj.hide();
        }
        obj.wrap('<div class="qeditor_border"></div>');
        obj.after(editor);
        return QEditor.renderToolbar(editor);
      });
    }
  };
})(jQuery);