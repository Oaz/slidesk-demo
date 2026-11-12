class CursorControl {
  constructor(rootSelector) {
    this.cursor = null;
    this.rootSelector = rootSelector;
  }

  onStart() {
    const svg = document.querySelector(this.rootSelector + " svg");
    this.cursor = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    this.cursor.setAttribute("class", "abcjs-cursor");
    this.cursor.setAttributeNS(null, "x1", 0);
    this.cursor.setAttributeNS(null, "y1", 0);
    this.cursor.setAttributeNS(null, "x2", 0);
    this.cursor.setAttributeNS(null, "y2", 0);
    svg.appendChild(this.cursor);
  }

  removeSelection() {
    const lastSelection = document.querySelectorAll(
      this.rootSelector + " .abcjs-highlight",
    );
    for (const el of lastSelection) el.classList.remove("abcjs-highlight");
  }

  onEvent(ev) {
    if (ev.measureStart && ev.left === null) return;
    this.removeSelection();
    for (const note of ev.elements)
      for (const el of note) el.classList.add("abcjs-highlight");

    if (this.cursor) {
      this.cursor.setAttribute("x1", ev.left - 2);
      this.cursor.setAttribute("x2", ev.left - 2);
      this.cursor.setAttribute("y1", ev.top);
      this.cursor.setAttribute("y2", ev.top + ev.height);
    }
  }

  onFinished() {
    this.removeSelection();
    if (this.cursor) {
      this.cursor.setAttribute("x1", 0);
      this.cursor.setAttribute("x2", 0);
      this.cursor.setAttribute("y1", 0);
      this.cursor.setAttribute("y2", 0);
    }
  }
}

window.slidesk.abc = {
  initiated: false,
  midiBuffer: null,
  synthControl: null,
  cursorControl: null,
  timingCallbacks: null,
  newSlide() {
    this.activate();
    document.querySelector(" #abcdef")?.remove();
    document.querySelector("#abcdef_audio")?.remove();
    const abctag = document.querySelector(".sd-current [data-abc]");
    if (abctag) {
      const divE = document.createElement("div");
      divE.id = "abcdef";
      const divA = document.createElement("div");
      divA.id = "abcdef_audio";
      abctag.parentElement.appendChild(divE);
      abctag.parentElement.appendChild(divA);
      this.define(
        document.querySelector(".sd-current #abcdef"),
        abctag.textContent,
      );
    }
  },
  activate() {
    if (!this.initiated) {
      this.initiated = true;
      if (ABCJS.synth.supportsAudio()) {
        this.midiBuffer = new ABCJS.synth.CreateSynth();
      } else {
        console.log("audio is not supported on this browser");
      }
    }
  },
  define(el, abcString) {
    this.cursorControl = new CursorControl("#abcdef");
    this.synthControl = new ABCJS.synth.SynthController();
    this.synthControl.load("#abcdef_audio", null, {
      displayPlay: true,
      displayProgress: false,
      displayClock: false,
    });
    this.synthControl.disable(true);
    const visualObj = ABCJS.renderAbc(el, abcString, {
      jazzchords: true,
      responsive: "resize",
      expandToWidest: true,
    });
    this.timingCallbacks = new ABCJS.TimingCallbacks(visualObj[0], {
      eventCallback: (ev) => {
        if (ev) window.slidesk.abc.cursorControl.onEvent(ev);
        else window.slidesk.abc.cursorControl.onFinished();
      },
    });
    this.midiBuffer
      .init({
        visualObj: visualObj[0],
        millisecondsPerMeasure: 800,
        options: {
          pan: [-0.5, 0.5],
        },
      })
      .then(() => {
        this.synthControl.setTune(visualObj[0], true).then(() => {
          document
            .querySelector(".abcjs-inline-audio")
            ?.classList.remove("disabled");
        });
      });
  },
};

window.slidesk.playSound = () => {
  if (document.querySelector(".sd-current [data-abc]")) {
    window.slidesk.abc.synthControl.play();
    window.slidesk.abc.cursorControl.onStart();
    window.slidesk.abc.timingCallbacks.start();
  }
};
