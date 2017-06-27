// ======================================>设置全局变量 && 获取DOM元素
var app = {
  editor: null,
  db: localStorage, // appMd
};
//head
var themeStyle = document.querySelector('#themeStyle');
// 编辑区域
var CodeMirrorArea = document.querySelector('#CodeMirror');
// 展示区域
var mdPlay = document.querySelector('#md-play');
//  设置区域
var mdSetting = document.querySelector('#mdSetting'); //设置区域
var toggleSetting = document.querySelector('#toggleSetting'); // 切换设置区域
var toggleWrap = document.querySelector('#toggleWrap'); //切换换行
var toggleFullScreen = document.querySelector('#toggleFullScreen'); // 切换全屏
var showH5 = document.querySelector('#showH5'); // 查看html源码
var openFile = document.querySelector('#openFile'); // 载入本地文件
var openFileAgent = document.querySelector('#openFileAgent'); // 载入本地文件
// ======================================>常用方法
// 进入全屏
function enterFullScreen() {
  var docElm = document.documentElement;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    //FireFox
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    //Chrome等
    docElm.webkitRequestFullScreen();
  } else if (elem.msRequestFullscreen) {
    //IE11
    elem.msRequestFullscreen();
  }
}
//退出全屏
function quitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}
//载入文件
function readFile(fileData) {
  if (!fileData || !fileData.type || !fileData.type.match("text.*")) {
    console.log('some thing wrong!')
    return;
  }
  var reader = new FileReader();
  reader.onerror = function() {
    console.log("Cannot read file, some eroor occuerd.");
    return;
  };
  reader.onload = function(evt) {
    CodeMirrorArea.innerHTML = evt.target.result;
    app.editor.setValue(evt.target.result);
  };
  reader.readAsText(fileData, "utf-8");
}
//在新标签页理查看文件
function viewRaw(file) {
  var text, blob;
  switch (file) {
    case "md":
      text = app.editor.getValue();
      break;
    case "html":
      text = mdPlay.innerHTML;
      break;
    default:
      console.log("invalid param");
      return;
  }
  blob = new Blob([text], {
    type: "text/plain",
    charset: "utf-8"
  });
  window.open(window.URL.createObjectURL(blob), "_blank");
}
//转化编辑器的内容到展示区（兼顾缓存功能）
function convert() {
  app.db.setItem('appMd', app.editor.getValue());
  mdPlay.innerHTML = marked(app.editor.getValue());
  // 为什么不起作用？
  $("#mdPlay pre code").each(function(i, e) {
    hljs.highlightBlock(e);
  });
}
// 根据缓存充实编辑内容
function initFromCache() {
  var appMdCache = app.db.getItem("appMd");
  if (appMdCache) {
    CodeMirrorArea.innerHTML = appMdCache;
    app.editor.setValue(appMdCache);
  }
}
// 阻止事件冒泡
function stopPropagation(e) {
  e = e || window.event;
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
}
// ======================================>CodeMirror与marked的初始化
//  声明CodeMirror实例
app.editor = CodeMirror.fromTextArea(CodeMirrorArea, {
  mode: "markdown", // 指明编辑器的语言
  value: CodeMirrorArea.value,
  theme: 'default', // 设置主题
  lineWrapping: true, // 是否换行
  lineNumbers: true, // 添加行号
  autofocus: true, // 初始化后自动获取焦点
  fullScreen: false, // 全屏模式
  placeholder: 'Code goes here...', //没有内容时候的占位符
  autoCloseBrackets: true, // 自动闭合括号引号等
  styleActiveLine: true, //光标所在行高亮
  extraKeys: {
    "Enter": "newlineAndIndentContinueMarkdownList", //markdown列表换行自动添加前导符号
  }
});
// 设置marked
marked.setOptions({
  renderer: new marked.Renderer(), // 声明使用的渲染器
  gfm: true,
  pedantic: false,
  sanitize: false,
  // highlight选项没有效果？
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});
// ======================================>运行程序
//自动同步到展示区域
app.editor.on('update', function() {
  convert();
});
// 根据缓存充实编辑内容
initFromCache();
// 快捷键实例
// $("body").keydown(function(event) {
//   var code = (event.keyCode ? event.keyCode : event.which),
//     ctrl = event.ctrlKey,
//     alt = event.altKey,
//     cmd = event.metaKey;
//   if ((ctrl || cmd) && code === 69) {
//     event.preventDefault();
//     convert();
//     return;
//   }
// });

// 选主题(此处应该用事件委托)
document.querySelectorAll('.select-theme').forEach(function(selectTheme, index, selectThemeList) {
  selectTheme.addEventListener('click', function() {
    if (!app.editor) return false;
    selectThemeList.forEach(function(item) {
      item.classList.remove('active');
    });
    selectTheme.classList.add('active');
    var theme = selectTheme.getAttribute('data-theme'),
      cssPath = "node_modules/codemirror/theme/" + theme + ".css";
    if (theme === "default") {
      cssPath = "css/empty.css";
    }
    app.editor.setOption("theme", theme);
    themeStyle.setAttribute('href', cssPath)
  });
});
//换行切换
toggleWrap.addEventListener('click', function() {
  app.editor.setOption('lineWrapping', app.editor.getOption('lineWrapping') ? false : true);
}, false);
//全屏切换
toggleFullScreen.addEventListener('click', function() {
  if (!app.editor.getOption('fullScreen')) {
    app.editor.setOption('fullScreen', true);
    enterFullScreen();
  } else {
    app.editor.setOption('fullScreen', false);
    quitFullScreen();
  }
}, false);
// 查看html源码
showH5.addEventListener('click', function() {
  console.log('html');
  viewRaw('html');
});
//载入本地文件
openFileAgent.addEventListener('click', function() {
  if (document.all) {
    openFile.click();
  } else {
    var e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    openFile.dispatchEvent(e);
  }
});
openFile.addEventListener('change', function() {
  readFile(openFile.files[0]);
}, false);
// 切换设置区域
mdSetting.addEventListener('click', function(event) {
  stopPropagation(event);
  mdSetting.classList.add('show');
});
document.body.addEventListener('click', function(event) {
  mdSetting.classList.remove('show');
});
