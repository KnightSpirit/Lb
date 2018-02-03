// Lb.js 1.0 config支持3个参数，第一个是图片的数组， 第二个是轮播的时间间隔，第三个是轮播发生的dom
function Lb(config) {
  let { imgs, interval, rootElId } = config;
  let rootEl = document.getElementById(rootElId);
  let ind = 1,
    seed;
  if (imgs.length === 0) {
    throw new Error("没有设置轮播图片");
  }

  if (isNaN(interval)) {
    throw new Error("时间间隔非数字");
  }

  // backBoard 是轮播图图片改变的dom
  let backBoard = CreateCustomElement("div", "win");
  // controlBar 是轮播进度条的Dom节点
  let controlBar = CreateCustomElement("div", "win-bar");

  // 根据图片数量会生成对应的bars
  let bars = imgs.map((v, i) => {
    let progressParent = CreateCustomElement("div", "base-progress");
    progressParent.dataset.outer = true;
    let progress = CreateCustomElement("div", "mask-progress");
    progressParent.appendChild(progress);
    progress.style.transitionDuration = `${interval}s`;
    return progressParent;
  });

  controlBar.addEventListener("click", e => {
    bars.forEach(v => {
      let son = v.children[0];
      ClearProgressEffect(v.children[0]);
      son.removeEventListener("transitionend", TransEnd);
    });
    let son = e.target.dataset.outer ? e.target : e.target.parentElement;
    ind = bars.indexOf(son) + 1;
    clearTimeout(seed);
    progress(ind);
  });

  bars.forEach(element => {
    controlBar.appendChild(element);
  });

  backBoard.appendChild(controlBar);
  rootEl.appendChild(backBoard);

  // 进度条滚动的设定
  function progress(ind) {
    let son = bars[ind - 1].querySelector(".mask-progress");
    backBoard.style.backgroundImage = `url(${imgs[ind - 1]})`;
    son.classList.add("run-progress");
    son.addEventListener("transitionend", TransEnd);
    son.style.transitionDuration = `${interval}s`;
    son.style.width = "100%";
  }

  function TransEnd(e) {
    let son = bars[ind - 1].querySelector(".mask-progress");
    ClearProgressEffect(son);
    clearTimeout(seed);
    ind++;
    Run();
  }

  // 进度条加载结束之后的清理
  function ClearProgressEffect(son) {
    son.style.transitionDuration = "";
    son.style.width = "0";
    son.classList.remove("run-progress");
  }

  function Run() {
    seed = setTimeout(() => {
      if (ind === imgs.length + 1) ind = 1;
      progress(ind);
    }, 4);
  }

  Run();
}

function CreateCustomElement(tag, className) {
  let el = document.createElement(tag);
  el.classList.add(className);
  return el;
}
