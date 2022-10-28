window.__webmetry = {
  generateId: () => { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
};

class WebmetryAxle {
  id;
  DOMElement;
  #config;
  #orientation;
  #offset;

  constructor(orientation, config) {
    this.#config = config;
    this.#orientation = orientation;
    this.#offset = {x: 0, y: 0};
    this.#createAxle(orientation);
  }

  #createAxle() {
    this.id = window.__webmetry.generateId();
    const axle = document.createElement("div");
    const marker = document.createElement("div");
    const aGrip = document.createElement("div");
    const bGrip = document.createElement("div");
    const positionLabel = document.createElement("div");

    if (this.#orientation === "vertical")
      axle.classList.add("wmtry-axle", `o-vertical`);
    else
      axle.classList.add("wmtry-axle", `o-horizontal`);
    
    marker.classList.add("wmtry-marker");
    aGrip.classList.add("wmtry-grip", "a-piece");
    bGrip.classList.add("wmtry-grip", "b-piece");
    positionLabel.classList.add("wmtry-position-label");

    marker.style.background = this.#config.color;
    aGrip.style.background = this.#config.gripColor;
    bGrip.style.background = this.#config.gripColor;

    axle.append(marker, aGrip, bGrip, positionLabel);

    axle.id = this.id;
    this.DOMElement = axle;
    return this;
  }

  mouseMove(e) {
    const label = this.DOMElement.querySelector(".wmtry-position-label");
      if (this.#orientation === "horizontal") {
        this.DOMElement.style.top = `${e.clientY - this.#offset.y}px`;
        label.innerHTML = `${e.clientY}px`;
        if(e.clientY > window.innerHeight / 2) {
          label.style.transform = "translate(-50%, -150%)";
        } else {
          label.style.transform = "translate(-50%, 100%)";
        }
      }else{
        this.DOMElement.style.left = `${e.clientX - this.#offset.x}px`;
        label.innerHTML = `${e.clientX}px`;
        if(e.clientX > window.innerWidth / 2) {
          label.style.transform = "translate(-150%, -50%)";
        } else {
          label.style.transform = "translate(50%, -50%)";
        }
      }
  }

  mouseDown(e) {
    this.#offset = { x: e.offsetX, y: e.offsetY };
  }
}

class WebmetryGrid {
  id;
  DOMElement;
  #config;

  constructor(config) {
    this.id = window.__webmetry.generateId();
    this.#config = config;
    const grid = document.createElement("div");
    grid.classList.add("wmtry-grid");

    config.breakpoints.forEach((bp) => {
      const gridBreak = document.createElement("div");
      const gbs = gridBreak.style;
      gridBreak.classList.add("wmtry-grid-break");
      gridBreak.dataset.until = bp.until;
      gbs.margin = bp.margin;
      for(let i = 1; i <= bp.columns; i++){
        if (i > 1) {
          const gutter = document.createElement("div");
          gutter.classList.add("wmtry-gutter");
          gutter.style.width = bp.gutter;
          gutter.style.background = bp.gutterColor;
          gridBreak.appendChild(gutter);
        }

        const column = document.createElement("div");
        column.classList.add("wmtry-column");
        column.style.width = `${100.0 / bp.columns}%`;
        column.style.background = bp.columnColor;
        gridBreak.appendChild(column);
      }
      grid.appendChild(gridBreak);
    });

    grid.id = this.id;
    this.DOMElement = grid;
    this.windowResized();
    return this;
  }

  windowResized() {
    const windowW = window.innerWidth;
    let breakpoints = this.#config.breakpoints.map((breakpoint) => {return parseInt(breakpoint.until);});
    breakpoints.sort;
    breakpoints.unshift(0);

    this.DOMElement.querySelectorAll(".wmtry-grid-break[data-until]").forEach((gridBreak) => {
      gridBreak.classList.remove("v-visible");
    });

    for(let i=0; i < breakpoints.length - 1; i++) {
      const bpFrom = breakpoints[i];
      const bpTo = breakpoints[i+1];

      if (windowW >= bpFrom && windowW <= bpTo) {
        this.DOMElement.querySelector(`.wmtry-grid-break[data-until='${bpTo}']`).classList.add("v-visible");
        break;
      }
    }
  }
}

class WebmetryMeasurementTape {
  id;
  DOMElement;
  #config;
  #DOMgripA;
  #DOMgripB;
  #connector;
  #offset;
  #currentGrip;
  #points;
  #aBase;
  #bBase;

  constructor(config) {
    this.id = window.__webmetry.generateId();
    this.#config = config;
    this.#points = {a: {x:0, y:0}, b: {x:0, y:0}};
    const tape = document.createElement("div");
    const aGrip = document.createElement("div");
    const bGrip = document.createElement("div");
    const aGripFixedVertical = document.createElement("div");
    const aGripFixedHorizontal = document.createElement("div");
    const bGripFixedVertical = document.createElement("div");
    const bGripFixedHorizontal = document.createElement("div");
    const aGripOrientedVertical = document.createElement("div");
    const aGripOrientedHorizontal = document.createElement("div");
    const bGripOrientedVertical = document.createElement("div");
    const bGripOrientedHorizontal = document.createElement("div");
    const aGripOrientedBase = document.createElement("div");
    const bGripOrientedBase = document.createElement("div");
    const connector = document.createElement("div");

    tape.classList.add("wmtry-measurement-tape");
    aGrip.classList.add("wmtry-grip", "a-piece");
    bGrip.classList.add("wmtry-grip", "b-piece");
    aGripFixedVertical.classList.add("wmtry-level", "o-vertical", "t-fixed");
    aGripFixedHorizontal.classList.add("wmtry-level", "o-horizontal", "t-fixed");
    aGripOrientedVertical.classList.add("wmtry-level", "o-vertical", "t-oriented");
    aGripOrientedHorizontal.classList.add("wmtry-level", "o-horizontal", "t-oriented");
    bGripFixedVertical.classList.add("wmtry-level", "o-vertical", "t-fixed");
    bGripFixedHorizontal.classList.add("wmtry-level", "o-horizontal", "t-fixed");
    bGripOrientedVertical.classList.add("wmtry-level", "o-vertical", "t-oriented");
    bGripOrientedHorizontal.classList.add("wmtry-level", "o-horizontal", "t-oriented");
    aGripOrientedBase.classList.add("wmtry-level-base", "a-piece");
    bGripOrientedBase.classList.add("wmtry-level-base", "b-piece");

    connector.classList.add("wmtry-connector");

    connector.style.background = this.#config.tapeColor;
    aGrip.style.background = this.#config.gripColor;
    bGrip.style.background = this.#config.gripColor;
    [aGripFixedVertical, aGripFixedHorizontal, bGripFixedVertical, bGripFixedHorizontal].forEach((guide) => {
      guide.style.background = this.#config.fixedGuideColor;
    });

    [aGripOrientedVertical, aGripOrientedHorizontal, bGripOrientedVertical, bGripOrientedHorizontal].forEach((guide) => {
      guide.style.background = this.#config.orientedGuideColor;
    });

    aGripOrientedBase.append(aGripOrientedHorizontal, aGripOrientedVertical);
    bGripOrientedBase.append(bGripOrientedHorizontal, bGripOrientedVertical);

    aGrip.append(aGripFixedHorizontal, aGripFixedVertical, aGripOrientedBase);
    bGrip.append(bGripFixedHorizontal, bGripFixedVertical, bGripOrientedBase);

    tape.append(
      aGrip, bGrip, connector,
    );

    tape.id = this.id;
    this.DOMElement = tape;
    this.#DOMgripA = aGrip;
    this.#DOMgripB = bGrip;
    this.#connector = connector;
    this.#aBase = aGripOrientedBase;
    this.#bBase = bGripOrientedBase;
    return this;
  }

  forceMove(grip, x, y) {
    this.#offset = { x: 0, y: 0 };
    this.#currentGrip = grip;
    this.mouseMove({ clientX: x, clientY: y });
  }

  mouseDown(e) {
    this.#offset = { x: e.offsetX, y: e.offsetY };
    this.#currentGrip = e.target.classList.contains("a-piece") ? "a" : "b";
    e.target.classList.add("s-dragging");
  }

  mouseUp(e) {
    [this.#DOMgripA, this.#DOMgripB].forEach((grip) => {
      grip.classList.remove("s-dragging");
    });
  }

  mouseMove(e) {
    this.#points[this.#currentGrip] = {
      x: e.clientX - this.#offset.x,
      y: e.clientY - this.#offset.y
    };
    this.#update();
  }

  #update() {
    const pts = this.#points;
    const grip = this.#currentGrip === "a" ? this.#DOMgripA : this.#DOMgripB;
    const halfGrip = grip.clientWidth / 2;
    const point = pts[this.#currentGrip];
    const cs = this.#connector.style;
    grip.style.left = `${point.x - halfGrip}px`;
    grip.style.top = `${point.y - halfGrip}px`;

    const edges = {};

    if (pts.a.y > pts.b.y) {
      edges.top = pts.b;
      edges.bottom = pts.a;
    }else {
      edges.top = pts.a;
      edges.bottom = pts.b;
    }

    if (pts.a.x > pts.b.x) {
      edges.left = pts.b;
      edges.right = pts.a;
    }else {
      edges.left = pts.a;
      edges.right = pts.b;
    }

    const width = edges.right.x - edges.left.x;
    const height = edges.bottom.y - edges.top.y;

    const deltaX = Math.abs(pts.b.x-pts.a.x);
    const deltaY = Math.abs(pts.b.y-pts.a.y);
    let angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    while (angle >= 360) angle -= 360;
    while (angle < 0) angle += 360;

    const distance = Math.sqrt((Math.pow(deltaX,2))+(Math.pow(deltaY,2)));

    cs.width = `${distance}px`;
    cs.top = `${edges.top.y + height / 2}px`;
    cs.left = `${edges.left.x + width / 2}px`;
    cs.transform = `translate(-50%, -50%) rotate(${edges.top.x > edges.left.x ? -angle : angle}deg)`;

    angle *= edges.top.x > edges.left.x ? -1 : 1;
    this.#aBase.style.transform = `rotate(${angle}deg)`;
    this.#bBase.style.transform = `rotate(${angle}deg)`;

    this.#connector.dataset.angle = `${Math.round(Math.abs(angle), 2)}°`;
    this.#connector.dataset.distance = `${Math.round(distance, 1)}px`;
  }
}

class Webmetry {
  #tools;
  #overlay;
  #config;
  #holdData;
  #lastInteractedTool;
  #fixedGrid;
  #infoElement;

  constructor() {
    this.#tools = {};
    this.#holdData = null;
    this.#lastInteractedTool = null;
    this.#fixedGrid = null;

    this.#buildConfig();
    this.#install();
  }

  toggleGrid() {
    if (this.#fixedGrid === null) {
      const grid = new WebmetryGrid(this.#config.grid);
      this.#overlay.appendChild(grid.DOMElement);
      this.#tools[grid.id] = grid;
      this.#fixedGrid = grid;
    } else {
      this.#fixedGrid.DOMElement.remove();
      delete this.#tools[this.#fixedGrid.id];
      this.#fixedGrid = null;
    }
  }

  addAxleSet() {
    const vAxle = new WebmetryAxle("vertical", this.#config.axle);
    this.#overlay.appendChild(vAxle.DOMElement);
    this.#tools[vAxle.id] = vAxle;

    const hAxle = new WebmetryAxle("horizontal", this.#config.axle);
    this.#overlay.appendChild(hAxle.DOMElement);
    this.#tools[hAxle.id] = hAxle;
  }

  addMeasurementTape() {
    const wWc = window.innerWidth / 2;
    const wHc = window.innerHeight / 2;
    const tape = new WebmetryMeasurementTape(this.#config.measurementTape);
    this.#overlay.appendChild(tape.DOMElement);
    this.#tools[tape.id] = tape;
    tape.forceMove("a", wWc - 100, wHc);
    tape.forceMove("b", wWc + 100, wHc);
  }

  #windowResized() {
    Object.keys(this.#tools).forEach(toolId => {
      const tool = this.#tools[toolId];
      if (tool instanceof WebmetryGrid) {
        tool.windowResized();
      }
    });
  }

  #mouseMove(e) {
    if (this.#holdData === null) { return; }

    const tool = this.#tools[this.#holdData.toolId];
    if (typeof tool.mouseDown === "function") {
      tool.mouseMove(e);
    }
  }

  #mouseUp(e) {
    if (this.#holdData !== null) {
      this.#lastInteractedTool = this.#tools[this.#holdData.toolId];
    } else {
      this.#lastInteractedTool = null;
    }

    Object.keys(this.#tools).forEach(toolId => {
      const tool = this.#tools[toolId];
      if (typeof tool.mouseUp === "function") {
        tool.mouseUp(e);
      }
    });
    this.#holdData = null;
  }

  #mouseDown(e) {
    if(e.target.classList.contains("wmtry-grip")) {
      let element = e.target.parentElement;
      while(element.id === "") {
        const parent = element.parentElement;
        if (parent === null) { return; }
        element = parent;
      }

      const tool = this.#tools[element.id];
      if (typeof tool.mouseDown === "function") {
        tool.mouseDown(e);
      }

      this.#holdData = {
        element: e.target,
        toolId: element.id,
      }
    }
  }

  #keyPressed(e) {
    if (!e.ctrlKey && !e.shiftKey) return;

    switch(e.key) {
      case "O":
        const cl = this.#overlay.classList;
        if (cl.contains("v-visible")) {
          cl.remove("v-visible");
        } else {
          cl.add("v-visible");
        }
      break;

      case "A":
        this.addAxleSet();
      break;

      case "T":
        this.addMeasurementTape();
      break;

      case "G":
        this.toggleGrid();
      break;

      case "R":
        if (this.#lastInteractedTool !== null) {
          const toolId = this.#lastInteractedTool.id;
          this.#lastInteractedTool.DOMElement.remove();
          delete this.#tools[toolId]; 
        }
      break;
    }
  }

  #configToObject(raw) {
    let configObject = {};

    raw.split(";").forEach((configPair) => {
      const pair = configPair.split(":");
      configObject[(pair[0] || "").trim()] = (pair[1] || "").trim();
    });

    return configObject;
  }

  #buildConfig() {
    const ac = this.#configToObject(document.currentScript.dataset?.axleConfig);
    const mtc = this.#configToObject(document.currentScript.dataset?.measurementTapeConfig);

    const gridConfigBreaks = (document.currentScript.dataset?.gridConfig || "").split("|").map((rawBreakConfig) => {
      const breakConfig = this.#configToObject(rawBreakConfig);

      return {
        until: breakConfig.until || 800,
        columns: breakConfig.columns || 12,
        gutter: breakConfig.gutter || "4px",
        margin: breakConfig.margin || "2px",
        gutterColor: breakConfig.gutterColor || "rgba(0,0,0,.6)",
        columnColor: breakConfig.columnColor || "rgba(0,0,0,.4)"
      }
    });

    this.#config = {
      grid: {
        breakpoints: gridConfigBreaks
      },
      axle: {
        color: ac.axleColor || "rgba(0,0,0,.3)",
        gripColor: ac.gripColor || "rgba(190,0,0,1)"
      },
      measurementTape: {
        tapeColor: ac.tapeColor || "rgba(0,0,0,.3)",
        gripColor: ac.gripColor || "rgba(190,0,0,.3)",
        fixedGuideColor: ac.fixedGuideColor || "rgba(190,0,0,.8)",
        orientedGuideColor: ac.orientedGuideColor || "rgba(0,0,190,.8)"
      }
    }
  }

  #install() {
    this.#overlay = document.createElement("div");
    this.#overlay.classList.add("wmtry-overlay", "v-visible");
    document.body.appendChild(this.#overlay);
    const ils = document.createElement("style");
    ils.innerHTML = "%%CSS%%";
    document.body.appendChild(ils);

    window.addEventListener("resize", this.#windowResized.bind(this));
    document.addEventListener("mousemove", this.#mouseMove.bind(this));
    document.addEventListener("mouseup", this.#mouseUp.bind(this));
    document.addEventListener("mousedown", this.#mouseDown.bind(this));
    window.addEventListener("keyup", this.#keyPressed.bind(this));

    this.#infoElement = document.createElement("div");
    this.#infoElement.classList.add("wmtry-info");
    this.#infoElement.innerHTML = "<b>webmetry</b> availale<br/><br/>";
    this.#infoElement.innerHTML += "<b>CTRL+SHIFT+O:</b> Toggle overlay<br/>";
    this.#infoElement.innerHTML += "<b>CTRL+SHIFT+A:</b> Add axles set<br/>";
    this.#infoElement.innerHTML += "<b>CTRL+SHIFT+T:</b> Add measurement tape<br/>";
    this.#infoElement.innerHTML += "<b>CTRL+SHIFT+G:</b> Toggle grid<br/>";
    this.#infoElement.innerHTML += "<b>CTRL+SHIFT+R:</b> Remove last interacted tool";

    document.body.appendChild(this.#infoElement);

    window.setTimeout(() => {
      this.#infoElement.remove();
    }, 5000);
  }
}

window.__webmetry.core = new Webmetry();
