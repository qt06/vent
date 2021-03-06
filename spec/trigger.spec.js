require('../lib/vent.min.js');

describe("Vent: trigger", () => {
  let rootElement;

  beforeEach(() => {
    rootElement = document.createElement("div");
    rootElement.innerHTML = `
            <div class="some-class">
                <ul id="some-list">
                    <li>item:1</li>
                    <li>item:2</li>
                </ul>
                <a href="#!">click me!</a>
            </div>
        `;
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    rootElement.remove();
  });

  it("Should return current instance", () => {
    const v = vent("li");
    expect(v.trigger("click")).toBe(v);
  });

  describe("Native events", () => {
    describe("new Event", () => {
      const _Event = Event;
      const _CustomEvent = CustomEvent;

      beforeEach(() => {
        Event = jest.fn();
        CustomEvent = jest.fn();
      });

      afterEach(() => {
        Event = _Event;
        CustomEvent = _CustomEvent;
      });

      describe("Without custom data", () => {
        describe("Triggered event is not a function", () => {
          it("Should create a new Event instance", () => {
            const eventsList = [
              "mouseenter",
              "mouseleave",
              "wheel",
              "drag",
              "toggle"
            ];
            eventsList.forEach(event => {
              vent("li")
                .each(node => (node.dispatchEvent = jest.fn))
                .trigger(event);
            });
            expect(Event).toHaveBeenCalledTimes(
              vent("li").length * eventsList.length
            );
          });

          it("Should set event bubbling to `true`", () => {
            vent("li")
              .each(node => (node.dispatchEvent = jest.fn))
              .trigger("mouseenter");

            expect(Event.mock.calls[0]).toEqual([
              "mouseenter",
              { bubbles: true }
            ]);
          });
        });
      });

      describe("With custom data", () => {
        it("Should create a new CustomEvent instance", () => {
          vent("li")
            .each(node => (node.dispatchEvent = jest.fn))
            .trigger("click", { data: { sample: "data" } });
          expect(CustomEvent).toHaveBeenCalledTimes(vent("li").length);
        });

        it("Should set event bubbling to `true` and `detail` to passed data", () => {
          vent("li")
            .each(node => (node.dispatchEvent = jest.fn))
            .trigger("click", { data: { sample: "data" } });

          expect(CustomEvent.mock.calls[0]).toEqual([
            "click",
            { bubbles: true, detail: { sample: "data" } }
          ]);
        });
      });

      describe("With custom configuration", () => {
        it("Should merge configuration with defaults", () => {
          vent("a")
            .each(node => (node.dispatchEvent = jest.fn))
            .trigger("mouseenter", { options: { bubbles: false } });
          expect(Event.mock.calls[0]).toEqual([
            "mouseenter",
            { bubbles: false }
          ]);
        });
      });
    });

    describe("dispatchEvent", () => {
      it("Should call dispatchEvent on elements", () => {
        const dispatchEvent = jest.fn();
        vent("li")
          .each(node => (node.dispatchEvent = dispatchEvent))
          .trigger("mouseenter")
          .trigger("mouseleave")
          .trigger("focus")
          .trigger("click");
        expect(dispatchEvent).toHaveBeenCalledTimes(8);
      });
    });
  });

  describe("CustomEvent", () => {
    describe("new Event", () => {
      const _Event = Event;
      const _CustomEvent = CustomEvent;

      beforeEach(() => {
        Event = jest.fn();
        CustomEvent = jest.fn();
      });

      afterEach(() => {
        Event = _Event;
        CustomEvent = _CustomEvent;
      });

      it("Should create a new CustomEvent instance", () => {
        vent("a")
          .each(node => (node.dispatchEvent = jest.fn))
          .trigger("sample");
        expect(CustomEvent).toHaveBeenCalledTimes(vent("a").length);
      });

      it("Should set event bubbling to `true` and `detail` to passed data", () => {
        vent("li")
          .each(node => (node.dispatchEvent = jest.fn))
          .trigger("sample", { data: { sample: "data" } });

        expect(CustomEvent.mock.calls[0]).toEqual([
          "sample",
          { bubbles: true, detail: { sample: "data" } }
        ]);
      });

      describe("With custom configuration", () => {
        it("Should merge configuration with defaults", () => {
          vent("a")
            .each(node => (node.dispatchEvent = jest.fn))
            .trigger("sample", { options: { bubbles: false } });
          expect(CustomEvent.mock.calls[0]).toEqual([
            "sample",
            { bubbles: false }
          ]);
        });
      });
    });

    describe("dispatchEvent", () => {
      it("Should call dispatchEvent on elements", () => {
        const dispatchEvent = jest.fn();
        vent("li")
          .each(node => (node.dispatchEvent = dispatchEvent))
          .trigger("sample");
        expect(dispatchEvent).toHaveBeenCalledTimes(2);
      });
    });
  });
});
