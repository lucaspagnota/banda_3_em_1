/* BANDA 3 EM 1 — layout e interações. Dados: conteudo.js; visual: styles.css.
 * Componentes reunidos em JavaScript legível, com runtime local em assets/runtime.js. */
"use strict";
(() => {
  // runtime:react
  var React = window.BandaRuntime.React;
  var Fragment = React.Fragment;
  var StrictMode = React.StrictMode;
  var createContext = React.createContext;
  var createElement = React.createElement;
  var forwardRef = React.forwardRef;
  var lazy = React.lazy;
  var use = React.use;
  var useCallback = React.useCallback;
  var useContext = React.useContext;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useState = React.useState;

  // runtime:react-dom/client
  var { createRoot } = window.BandaRuntime;

  // ../../node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
  var toKebabCase = (string) => string?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  // ../../node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
  function toLucideIconData(iconName, iconNode, aliases = []) {
    if (iconNode == null) {
      throw new Error("[lucide]: iconNode is required when icon name is used");
    }
    return {
      name: toKebabCase(iconName),
      size: 24,
      node: iconNode,
      ...aliases.length > 0 ? { aliases } : {}
    };
  }

  // ../../node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
  var toCamelCase = (string) => {
    let out = "";
    let upperNext = false;
    for (const ch of string) {
      if (ch === "-" || ch === "_" || ch <= " ") {
        upperNext = out.length > 0;
        continue;
      }
      if (out.length === 0) {
        out += ch.toLowerCase();
      } else {
        out += upperNext ? ch.toUpperCase() : ch;
      }
      upperNext = false;
    }
    return out;
  };

  // ../../node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
  var toPascalCase = (string) => {
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  };

  // ../../node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
  var mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
  }).join(" ").trim();

  // ../../node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };

  // ../../node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
  function isDefined(value) {
    return value !== null && value !== void 0;
  }
  function buildLucideIconNode(icon, params = {}) {
    const attributeNames = params.attributeNames ?? {};
    const getAttributeName = (attributeName) => attributeNames[attributeName] ?? attributeName;
    const viewBoxWidth = icon.size ?? icon.width ?? defaultAttributes["width"];
    const viewBoxHeight = icon.size ?? icon.height ?? defaultAttributes["height"];
    const aliasClassNames = icon.aliases?.filter((alias) => typeof alias === "string" && alias.trim() !== "").map((alias) => `lucide-${alias}`) ?? [];
    const iconClassNames = [...icon.name ? [`lucide-${icon.name}`] : [], ...aliasClassNames];
    const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
    const className = params.includeDefaultClasses === false ? mergeClasses(...classNamesFromClassName) : mergeClasses("lucide", ...iconClassNames, ...classNamesFromClassName);
    const calculatedStrokeWidth = params.absoluteStrokeWidth ? Number(params.strokeWidth ?? defaultAttributes["stroke-width"]) * Number(icon.size ?? icon.width ?? defaultAttributes["width"]) / Number(params.size ?? params.width ?? defaultAttributes["width"]) : params.strokeWidth ?? defaultAttributes["stroke-width"];
    const attributes = {
      ...Object.entries(defaultAttributes).reduce((attrs, [attrName, value]) => {
        attrs[getAttributeName(attrName)] = value;
        return attrs;
      }, {}),
      ..."color" in params && params.color && {
        [getAttributeName("stroke")]: params.color
      },
      ..."size" in params && isDefined(params.size) && {
        [getAttributeName("width")]: params.size,
        [getAttributeName("height")]: params.size
      },
      ..."width" in params && isDefined(params.width) && {
        [getAttributeName("width")]: params.width
      },
      ..."height" in params && isDefined(params.height) && {
        [getAttributeName("height")]: params.height
      },
      [getAttributeName("stroke-width")]: calculatedStrokeWidth,
      ...className && {
        [getAttributeName("class")]: className
      },
      [getAttributeName("viewBox")]: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
      ...params.hasA11yProp === false ? {
        [getAttributeName("aria-hidden")]: "true"
      } : {},
      ..."attributes" in params && params.attributes
    };
    return [
      "svg",
      attributes,
      icon.node.map((child) => {
        const [name, attrs, children] = child;
        const nextAttrs = params.nonScalingStroke ? { [getAttributeName("vector-effect")]: "non-scaling-stroke", ...attrs } : attrs;
        return children ? [name, nextAttrs, children] : [name, nextAttrs];
      })
    ];
  }

  // ../../node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
  function buildLucideIconForReact(icon, params = {}) {
    return buildLucideIconNode(icon, {
      ...params,
      attributeNames: {
        ...params.attributeNames,
        class: "className",
        "stroke-width": "strokeWidth",
        "stroke-linecap": "strokeLinecap",
        "stroke-linejoin": "strokeLinejoin",
        "vector-effect": "vectorEffect"
      }
    });
  }

  // ../../node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
  var hasA11yProp = (props) => {
    for (const prop in props) {
      if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
        return true;
      }
    }
    return false;
  };

  // ../../node_modules/lucide-react/dist/esm/context.mjs
  var LucideContext = createContext({});
  var useLucideContext = () => useContext(LucideContext);

  // ../../node_modules/lucide-react/dist/esm/Icon.mjs
  var Icon = forwardRef(
    ({
      color,
      size,
      width,
      height,
      strokeWidth,
      absoluteStrokeWidth,
      nonScalingStroke,
      className = "",
      children,
      iconNode = [],
      icon = {
        node: iconNode,
        aliases: [],
        size: 24
      },
      ...rest
    }, ref) => {
      const {
        size: contextSize = 24,
        strokeWidth: contextStrokeWidth = 2,
        absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
        nonScalingStroke: contextNonScalingStroke = false,
        color: contextColor = "currentColor",
        className: contextClass = ""
      } = useLucideContext() ?? {};
      const hasAccessibleProp = Boolean(children) || hasA11yProp(rest);
      const [name, svgAttributes, builtIconNode = []] = buildLucideIconForReact(icon, {
        color: color ?? contextColor,
        width: width ?? size ?? contextSize,
        height: height ?? size ?? contextSize,
        strokeWidth: strokeWidth ?? contextStrokeWidth,
        absoluteStrokeWidth: absoluteStrokeWidth ?? contextAbsoluteStrokeWidth,
        nonScalingStroke: nonScalingStroke ?? contextNonScalingStroke,
        className: mergeClasses(contextClass, className),
        hasA11yProp: hasAccessibleProp,
        attributes: rest
      });
      return createElement(
        name,
        {
          ref,
          ...svgAttributes
        },
        [
          ...builtIconNode.map(([tag, attrs]) => createElement(tag, attrs)),
          ...Array.isArray(children) ? children : [children]
        ]
      );
    }
  );

  // ../../node_modules/lucide-react/dist/esm/createLucideIcon.mjs
  function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
    const iconData = typeof iconDataOrName === "string" ? toLucideIconData(iconDataOrName, iconNode, aliases) : iconDataOrName;
    const Component2 = forwardRef(
      ({ className, ...props }, ref) => createElement(Icon, {
        ref,
        icon: iconData,
        className,
        ...props
      })
    );
    if (iconData.name) {
      Component2.displayName = toPascalCase(iconData.name);
    }
    return Component2;
  }

  // ../../node_modules/lucide-react/dist/esm/icons/arrow-right.mjs
  var __iconData = {
    name: "arrow-right",
    size: 24,
    node: [
      ["path", { d: "M5 12h14", key: "1ays0h" }],
      ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
    ]
  };
  __iconData.node;
  var ArrowRight = createLucideIcon(__iconData);

  // ../../node_modules/lucide-react/dist/esm/icons/arrow-up-right.mjs
  var __iconData2 = {
    name: "arrow-up-right",
    size: 24,
    node: [
      ["path", { d: "M7 7h10v10", key: "1tivn9" }],
      ["path", { d: "M7 17 17 7", key: "1vkiza" }]
    ]
  };
  __iconData2.node;
  var ArrowUpRight = createLucideIcon(__iconData2);

  // ../../node_modules/lucide-react/dist/esm/icons/arrow-up.mjs
  var __iconData3 = {
    name: "arrow-up",
    size: 24,
    node: [
      ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
      ["path", { d: "M12 19V5", key: "x0mq9r" }]
    ]
  };
  __iconData3.node;
  var ArrowUp = createLucideIcon(__iconData3);

  // ../../node_modules/lucide-react/dist/esm/icons/calendar-clock.mjs
  var __iconData4 = {
    name: "calendar-clock",
    size: 24,
    node: [
      ["path", { d: "M16 14v2.2l1.6 1", key: "fo4ql5" }],
      ["path", { d: "M16 2v3", key: "otl347" }],
      ["path", { d: "M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338", key: "7hb8p4" }],
      ["path", { d: "M3 9h5.859", key: "numkqi" }],
      ["path", { d: "M8 2v3", key: "1ioesn" }],
      ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
    ]
  };
  __iconData4.node;
  var CalendarClock = createLucideIcon(__iconData4);

  // ../../node_modules/lucide-react/dist/esm/icons/calendar-days.mjs
  var __iconData5 = {
    name: "calendar-days",
    size: 24,
    node: [
      ["path", { d: "M8 2v3", key: "1ioesn" }],
      ["path", { d: "M16 2v3", key: "otl347" }],
      ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" }],
      ["path", { d: "M3 9h18", key: "1pudct" }],
      ["path", { d: "M8 13h.01", key: "1sbv64" }],
      ["path", { d: "M12 13h.01", key: "y0uutt" }],
      ["path", { d: "M16 13h.01", key: "wip0gl" }],
      ["path", { d: "M8 17h.01", key: "p3bg7i" }],
      ["path", { d: "M12 17h.01", key: "p32p05" }],
      ["path", { d: "M16 17h.01", key: "ql8jdd" }]
    ]
  };
  __iconData5.node;
  var CalendarDays = createLucideIcon(__iconData5);

  // ../../node_modules/lucide-react/dist/esm/icons/camera.mjs
  var __iconData6 = {
    name: "camera",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
          key: "18u6gg"
        }
      ],
      ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
    ]
  };
  __iconData6.node;
  var Camera = createLucideIcon(__iconData6);

  // ../../node_modules/lucide-react/dist/esm/icons/cassette-tape.mjs
  var __iconData7 = {
    name: "cassette-tape",
    size: 24,
    node: [
      ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
      ["circle", { cx: "8", cy: "10", r: "2", key: "1xl4ub" }],
      ["path", { d: "M8 12h8", key: "1wcyev" }],
      ["circle", { cx: "16", cy: "10", r: "2", key: "r14t7q" }],
      [
        "path",
        { d: "m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3", key: "l01ucn" }
      ]
    ]
  };
  __iconData7.node;
  var CassetteTape = createLucideIcon(__iconData7);

  // ../../node_modules/lucide-react/dist/esm/icons/check.mjs
  var __iconData8 = {
    name: "check",
    size: 24,
    node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
  };
  __iconData8.node;
  var Check = createLucideIcon(__iconData8);

  // ../../node_modules/lucide-react/dist/esm/icons/chevron-down.mjs
  var __iconData9 = {
    name: "chevron-down",
    size: 24,
    node: [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]]
  };
  __iconData9.node;
  var ChevronDown = createLucideIcon(__iconData9);

  // ../../node_modules/lucide-react/dist/esm/icons/chevron-left.mjs
  var __iconData10 = {
    name: "chevron-left",
    size: 24,
    node: [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]]
  };
  __iconData10.node;
  var ChevronLeft = createLucideIcon(__iconData10);

  // ../../node_modules/lucide-react/dist/esm/icons/chevron-right.mjs
  var __iconData11 = {
    name: "chevron-right",
    size: 24,
    node: [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]]
  };
  __iconData11.node;
  var ChevronRight = createLucideIcon(__iconData11);

  // ../../node_modules/lucide-react/dist/esm/icons/circle-alert.mjs
  var __iconData12 = {
    name: "circle-alert",
    size: 24,
    node: [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
      ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
    ],
    aliases: ["alert-circle"]
  };
  __iconData12.node;
  var CircleAlert = createLucideIcon(__iconData12);

  // ../../node_modules/lucide-react/dist/esm/icons/circle-check.mjs
  var __iconData13 = {
    name: "circle-check",
    size: 24,
    node: [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["path", { d: "m16 9-5.5 5.5L8 12", key: "xofnsj" }]
    ],
    aliases: ["check-circle-2"]
  };
  __iconData13.node;
  var CircleCheck = createLucideIcon(__iconData13);

  // ../../node_modules/lucide-react/dist/esm/icons/clock.mjs
  var __iconData14 = {
    name: "clock",
    size: 24,
    node: [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
    ]
  };
  __iconData14.node;
  var Clock = createLucideIcon(__iconData14);

  // ../../node_modules/lucide-react/dist/esm/icons/copy.mjs
  var __iconData15 = {
    name: "copy",
    size: 24,
    node: [
      ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
      ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
    ]
  };
  __iconData15.node;
  var Copy = createLucideIcon(__iconData15);

  // ../../node_modules/lucide-react/dist/esm/icons/external-link.mjs
  var __iconData16 = {
    name: "external-link",
    size: 24,
    node: [
      ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
      ["path", { d: "M10 14 21 3", key: "gplh6r" }],
      ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
    ]
  };
  __iconData16.node;
  var ExternalLink = createLucideIcon(__iconData16);

  // ../../node_modules/lucide-react/dist/esm/icons/film.mjs
  var __iconData17 = {
    name: "film",
    size: 24,
    node: [
      ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
      ["path", { d: "M7 3v18", key: "bbkbws" }],
      ["path", { d: "M3 7.5h4", key: "zfgn84" }],
      ["path", { d: "M3 12h18", key: "1i2n21" }],
      ["path", { d: "M3 16.5h4", key: "1230mu" }],
      ["path", { d: "M17 3v18", key: "in4fa5" }],
      ["path", { d: "M17 7.5h4", key: "myr1c1" }],
      ["path", { d: "M17 16.5h4", key: "go4c1d" }]
    ]
  };
  __iconData17.node;
  var Film = createLucideIcon(__iconData17);

  // ../../node_modules/lucide-react/dist/esm/icons/guitar.mjs
  var __iconData19 = {
    name: "guitar",
    size: 24,
    node: [
      ["path", { d: "m11.9 12.1 4.514-4.514", key: "109xqo" }],
      [
        "path",
        {
          d: "M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z",
          key: "txyc8t"
        }
      ],
      ["path", { d: "m6 16 2 2", key: "16qmzd" }],
      [
        "path",
        {
          d: "M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z",
          key: "1de1vg"
        }
      ]
    ]
  };
  __iconData19.node;
  var Guitar = createLucideIcon(__iconData19);

  // ../../node_modules/lucide-react/dist/esm/icons/info.mjs
  var __iconData21 = {
    name: "info",
    size: 24,
    node: [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["path", { d: "M12 16v-4", key: "1dtifu" }],
      ["path", { d: "M12 8h.01", key: "e9boi3" }]
    ]
  };
  __iconData21.node;
  var Info = createLucideIcon(__iconData21);

  // ../../node_modules/lucide-react/dist/esm/icons/mail.mjs
  var __iconData22 = {
    name: "mail",
    size: 24,
    node: [
      ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
      ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
    ]
  };
  __iconData22.node;
  var Mail = createLucideIcon(__iconData22);

  // ../../node_modules/lucide-react/dist/esm/icons/map-pin.mjs
  var __iconData23 = {
    name: "map-pin",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
          key: "1r0f0z"
        }
      ],
      ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
    ]
  };
  __iconData23.node;
  var MapPin = createLucideIcon(__iconData23);

  // ../../node_modules/lucide-react/dist/esm/icons/music.mjs
  var __iconData24 = {
    name: "music",
    size: 24,
    node: [
      ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
      ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
      ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
    ]
  };
  __iconData24.node;
  var Music = createLucideIcon(__iconData24);

  // ../../node_modules/lucide-react/dist/esm/icons/navigation.mjs
  var __iconData25 = {
    name: "navigation",
    size: 24,
    node: [["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]]
  };
  __iconData25.node;
  var Navigation = createLucideIcon(__iconData25);

  // ../../node_modules/lucide-react/dist/esm/icons/play.mjs
  var __iconData26 = {
    name: "play",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
          key: "10ikf1"
        }
      ]
    ]
  };
  __iconData26.node;
  var Play = createLucideIcon(__iconData26);

  // ../../node_modules/lucide-react/dist/esm/icons/plus.mjs
  var __iconData27 = {
    name: "plus",
    size: 24,
    node: [
      ["path", { d: "M5 12h14", key: "1ays0h" }],
      ["path", { d: "M12 5v14", key: "s699le" }]
    ]
  };
  __iconData27.node;
  var Plus = createLucideIcon(__iconData27);

  // ../../node_modules/lucide-react/dist/esm/icons/x.mjs
  var __iconData30 = {
    name: "x",
    size: 24,
    node: [
      ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
      ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
    ]
  };
  __iconData30.node;
  var X = createLucideIcon(__iconData30);

  // ../../node_modules/lucide-react/dist/esm/icons/zoom-in.mjs
  var __iconData32 = {
    name: "zoom-in",
    size: 24,
    node: [
      ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
      ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
      ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
      ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
    ]
  };
  __iconData32.node;
  var ZoomIn = createLucideIcon(__iconData32);

  // content:@/conteudo
  var MENU = window.CONTEUDO.MENU;
  var HERO = window.CONTEUDO.HERO;
  var FAIXA_ESTILOS = window.CONTEUDO.FAIXA_ESTILOS;
  var SOBRE = window.CONTEUDO.SOBRE;
  var EXPERIENCIA = window.CONTEUDO.EXPERIENCIA;
  var REPERTORIO_TEXTOS = window.CONTEUDO.REPERTORIO_TEXTOS;
  var CATEGORIAS = window.CONTEUDO.CATEGORIAS;
  var REPERTORIO = window.CONTEUDO.REPERTORIO;
  var AGENDA_TEXTOS = window.CONTEUDO.AGENDA_TEXTOS;
  var GALERIA_TEXTOS = window.CONTEUDO.GALERIA_TEXTOS;
  var VIDEOS_TEXTOS = window.CONTEUDO.VIDEOS_TEXTOS;
  var CONTRATACAO = window.CONTEUDO.CONTRATACAO;
  var FAQ_TEXTOS = window.CONTEUDO.FAQ_TEXTOS;
  var FAQ = window.CONTEUDO.FAQ;
  var RODAPE = window.CONTEUDO.RODAPE;

  // ../../src/hooks.ts
  var revealCallbacks = /* @__PURE__ */ new WeakMap();
  var revealObserver = null;
  function getRevealObserver() {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealCallbacks.get(entry.target)?.();
            revealCallbacks.delete(entry.target);
            revealObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" }
      );
    }
    return revealObserver;
  }
  function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const element = ref.current;
      if (!element) return;
      const observer = getRevealObserver();
      if (!observer) {
        setVisible(true);
        return;
      }
      revealCallbacks.set(element, () => setVisible(true));
      observer.observe(element);
      return () => {
        observer.unobserve(element);
        revealCallbacks.delete(element);
      };
    }, []);
    return [ref, visible];
  }
  function useScrolled(offset = 24) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > offset);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, [offset]);
    return scrolled;
  }
  function useActiveSection(ids) {
    const [active, setActive] = useState(ids[0] ?? "");
    useEffect(() => {
      if (!("IntersectionObserver" in window)) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const hit = entries.find((entry) => entry.isIntersecting);
          if (hit) setActive(hit.target.id);
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
      return () => observer.disconnect();
    }, [ids]);
    return active;
  }
  var lockCount = 0;
  function useLockBodyScroll(locked) {
    useEffect(() => {
      if (!locked) return;
      lockCount += 1;
      document.documentElement.style.overflow = "hidden";
      return () => {
        lockCount = Math.max(0, lockCount - 1);
        if (lockCount === 0) document.documentElement.style.overflow = "";
      };
    }, [locked]);
  }

  // ../../node_modules/clsx/dist/clsx.mjs
  function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
      var o = e.length;
      for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else for (f in e) e[f] && (n && (n += " "), n += f);
    return n;
  }
  function clsx() {
    for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
  }

  // ../../node_modules/tailwind-merge/dist/bundle-mjs.mjs
  var concatArrays = (array1, array2) => {
    const combinedArray = new Array(array1.length + array2.length);
    for (let i = 0; i < array1.length; i++) {
      combinedArray[i] = array1[i];
    }
    for (let i = 0; i < array2.length; i++) {
      combinedArray[array1.length + i] = array2[i];
    }
    return combinedArray;
  };
  var createClassValidatorObject = (classGroupId, validator) => ({
    classGroupId,
    validator
  });
  var createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators = null, classGroupId) => ({
    nextPart,
    validators,
    classGroupId
  });
  var CLASS_PART_SEPARATOR = "-";
  var EMPTY_CONFLICTS = [];
  var ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
  var createClassGroupUtils = (config) => {
    const classMap = createClassMap(config);
    const {
      conflictingClassGroups,
      conflictingClassGroupModifiers
    } = config;
    const getClassGroupId = (className) => {
      if (className.startsWith("[") && className.endsWith("]")) {
        return getGroupIdForArbitraryProperty(className);
      }
      const classParts = className.split(CLASS_PART_SEPARATOR);
      const startIndex = classParts[0] === "" && classParts.length > 1 ? 1 : 0;
      return getGroupRecursive(classParts, startIndex, classMap);
    };
    const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
      if (hasPostfixModifier) {
        const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
        const baseConflicts = conflictingClassGroups[classGroupId];
        if (modifierConflicts) {
          if (baseConflicts) {
            return concatArrays(baseConflicts, modifierConflicts);
          }
          return modifierConflicts;
        }
        return baseConflicts || EMPTY_CONFLICTS;
      }
      return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
    };
    return {
      getClassGroupId,
      getConflictingClassGroupIds
    };
  };
  var getGroupRecursive = (classParts, startIndex, classPartObject) => {
    const classPathsLength = classParts.length - startIndex;
    if (classPathsLength === 0) {
      return classPartObject.classGroupId;
    }
    const currentClassPart = classParts[startIndex];
    const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    if (nextClassPartObject) {
      const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
      if (result) return result;
    }
    const validators = classPartObject.validators;
    if (validators === null) {
      return void 0;
    }
    const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
    const validatorsLength = validators.length;
    for (let i = 0; i < validatorsLength; i++) {
      const validatorObj = validators[i];
      if (validatorObj.validator(classRest)) {
        return validatorObj.classGroupId;
      }
    }
    return void 0;
  };
  var getGroupIdForArbitraryProperty = (className) => className.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
    const content = className.slice(1, -1);
    const colonIndex = content.indexOf(":");
    const property = content.slice(0, colonIndex);
    return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
  })();
  var createClassMap = (config) => {
    const {
      theme,
      classGroups
    } = config;
    return processClassGroups(classGroups, theme);
  };
  var processClassGroups = (classGroups, theme) => {
    const classMap = createClassPartObject();
    for (const classGroupId in classGroups) {
      const group = classGroups[classGroupId];
      processClassesRecursively(group, classMap, classGroupId, theme);
    }
    return classMap;
  };
  var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
    const len = classGroup.length;
    for (let i = 0; i < len; i++) {
      const classDefinition = classGroup[i];
      processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
    }
  };
  var processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
    if (typeof classDefinition === "string") {
      processStringDefinition(classDefinition, classPartObject, classGroupId);
      return;
    }
    if (typeof classDefinition === "function") {
      processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
      return;
    }
    processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
  };
  var processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
    const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
    classPartObjectToEdit.classGroupId = classGroupId;
  };
  var processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
    if (isThemeGetter(classDefinition)) {
      processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
      return;
    }
    if (classPartObject.validators === null) {
      classPartObject.validators = [];
    }
    classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
  };
  var processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
    const entries = Object.entries(classDefinition);
    const len = entries.length;
    for (let i = 0; i < len; i++) {
      const [key, value] = entries[i];
      processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
    }
  };
  var getPart = (classPartObject, path) => {
    let current = classPartObject;
    const parts = path.split(CLASS_PART_SEPARATOR);
    const len = parts.length;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      let next = current.nextPart.get(part);
      if (!next) {
        next = createClassPartObject();
        current.nextPart.set(part, next);
      }
      current = next;
    }
    return current;
  };
  var isThemeGetter = (func) => "isThemeGetter" in func && func.isThemeGetter === true;
  var createLruCache = (maxCacheSize) => {
    if (maxCacheSize < 1) {
      return {
        get: () => void 0,
        set: () => {
        }
      };
    }
    let cacheSize = 0;
    let cache = /* @__PURE__ */ Object.create(null);
    let previousCache = /* @__PURE__ */ Object.create(null);
    const update = (key, value) => {
      cache[key] = value;
      cacheSize++;
      if (cacheSize > maxCacheSize) {
        cacheSize = 0;
        previousCache = cache;
        cache = /* @__PURE__ */ Object.create(null);
      }
    };
    return {
      get(key) {
        let value = cache[key];
        if (value !== void 0) {
          return value;
        }
        if ((value = previousCache[key]) !== void 0) {
          update(key, value);
          return value;
        }
      },
      set(key, value) {
        if (key in cache) {
          cache[key] = value;
        } else {
          update(key, value);
        }
      }
    };
  };
  var IMPORTANT_MODIFIER = "!";
  var MODIFIER_SEPARATOR = ":";
  var EMPTY_MODIFIERS = [];
  var createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition, isExternal) => ({
    modifiers,
    hasImportantModifier,
    baseClassName,
    maybePostfixModifierPosition,
    isExternal
  });
  var createParseClassName = (config) => {
    const {
      prefix,
      experimentalParseClassName
    } = config;
    let parseClassName = (className) => {
      const modifiers = [];
      let bracketDepth = 0;
      let parenDepth = 0;
      let modifierStart = 0;
      let postfixModifierPosition;
      const len = className.length;
      for (let index = 0; index < len; index++) {
        const currentCharacter = className[index];
        if (bracketDepth === 0 && parenDepth === 0) {
          if (currentCharacter === MODIFIER_SEPARATOR) {
            modifiers.push(className.slice(modifierStart, index));
            modifierStart = index + 1;
            continue;
          }
          if (currentCharacter === "/") {
            postfixModifierPosition = index;
            continue;
          }
        }
        if (currentCharacter === "[") bracketDepth++;
        else if (currentCharacter === "]") bracketDepth--;
        else if (currentCharacter === "(") parenDepth++;
        else if (currentCharacter === ")") parenDepth--;
      }
      const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
      let baseClassName = baseClassNameWithImportantModifier;
      let hasImportantModifier = false;
      if (baseClassNameWithImportantModifier.endsWith(IMPORTANT_MODIFIER)) {
        baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
        hasImportantModifier = true;
      } else if (
        /**
         * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
         * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
         */
        baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)
      ) {
        baseClassName = baseClassNameWithImportantModifier.slice(1);
        hasImportantModifier = true;
      }
      const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
      return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
    };
    if (prefix) {
      const fullPrefix = prefix + MODIFIER_SEPARATOR;
      const parseClassNameOriginal = parseClassName;
      parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.slice(fullPrefix.length)) : createResultObject(EMPTY_MODIFIERS, false, className, void 0, true);
    }
    if (experimentalParseClassName) {
      const parseClassNameOriginal = parseClassName;
      parseClassName = (className) => experimentalParseClassName({
        className,
        parseClassName: parseClassNameOriginal
      });
    }
    return parseClassName;
  };
  var createSortModifiers = (config) => {
    const modifierWeights = /* @__PURE__ */ new Map();
    config.orderSensitiveModifiers.forEach((mod, index) => {
      modifierWeights.set(mod, 1e6 + index);
    });
    return (modifiers) => {
      const result = [];
      let currentSegment = [];
      for (let i = 0; i < modifiers.length; i++) {
        const modifier = modifiers[i];
        const isArbitrary = modifier[0] === "[";
        const isOrderSensitive = modifierWeights.has(modifier);
        if (isArbitrary || isOrderSensitive) {
          if (currentSegment.length > 0) {
            currentSegment.sort();
            result.push(...currentSegment);
            currentSegment = [];
          }
          result.push(modifier);
        } else {
          currentSegment.push(modifier);
        }
      }
      if (currentSegment.length > 0) {
        currentSegment.sort();
        result.push(...currentSegment);
      }
      return result;
    };
  };
  var createConfigUtils = (config) => ({
    cache: createLruCache(config.cacheSize),
    parseClassName: createParseClassName(config),
    sortModifiers: createSortModifiers(config),
    ...createClassGroupUtils(config)
  });
  var SPLIT_CLASSES_REGEX = /\s+/;
  var mergeClassList = (classList, configUtils) => {
    const {
      parseClassName,
      getClassGroupId,
      getConflictingClassGroupIds,
      sortModifiers
    } = configUtils;
    const classGroupsInConflict = [];
    const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
    let result = "";
    for (let index = classNames.length - 1; index >= 0; index -= 1) {
      const originalClassName = classNames[index];
      const {
        isExternal,
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      } = parseClassName(originalClassName);
      if (isExternal) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      let hasPostfixModifier = !!maybePostfixModifierPosition;
      let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
      if (!classGroupId) {
        if (!hasPostfixModifier) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        classGroupId = getClassGroupId(baseClassName);
        if (!classGroupId) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        hasPostfixModifier = false;
      }
      const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
      const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
      const classId = modifierId + classGroupId;
      if (classGroupsInConflict.indexOf(classId) > -1) {
        continue;
      }
      classGroupsInConflict.push(classId);
      const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
      for (let i = 0; i < conflictGroups.length; ++i) {
        const group = conflictGroups[i];
        classGroupsInConflict.push(modifierId + group);
      }
      result = originalClassName + (result.length > 0 ? " " + result : result);
    }
    return result;
  };
  var twJoin = (...classLists) => {
    let index = 0;
    let argument;
    let resolvedValue;
    let string = "";
    while (index < classLists.length) {
      if (argument = classLists[index++]) {
        if (resolvedValue = toValue(argument)) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  };
  var toValue = (mix) => {
    if (typeof mix === "string") {
      return mix;
    }
    let resolvedValue;
    let string = "";
    for (let k = 0; k < mix.length; k++) {
      if (mix[k]) {
        if (resolvedValue = toValue(mix[k])) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  };
  var createTailwindMerge = (createConfigFirst, ...createConfigRest) => {
    let configUtils;
    let cacheGet;
    let cacheSet;
    let functionToCall;
    const initTailwindMerge = (classList) => {
      const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
      configUtils = createConfigUtils(config);
      cacheGet = configUtils.cache.get;
      cacheSet = configUtils.cache.set;
      functionToCall = tailwindMerge;
      return tailwindMerge(classList);
    };
    const tailwindMerge = (classList) => {
      const cachedResult = cacheGet(classList);
      if (cachedResult) {
        return cachedResult;
      }
      const result = mergeClassList(classList, configUtils);
      cacheSet(classList, result);
      return result;
    };
    functionToCall = initTailwindMerge;
    return (...args) => functionToCall(twJoin(...args));
  };
  var fallbackThemeArr = [];
  var fromTheme = (key) => {
    const themeGetter = (theme) => theme[key] || fallbackThemeArr;
    themeGetter.isThemeGetter = true;
    return themeGetter;
  };
  var arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
  var arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
  var fractionRegex = /^\d+\/\d+$/;
  var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
  var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
  var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
  var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
  var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
  var isFraction = (value) => fractionRegex.test(value);
  var isNumber = (value) => !!value && !Number.isNaN(Number(value));
  var isInteger = (value) => !!value && Number.isInteger(Number(value));
  var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
  var isTshirtSize = (value) => tshirtUnitRegex.test(value);
  var isAny = () => true;
  var isLengthOnly = (value) => (
    // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
  );
  var isNever = () => false;
  var isShadow = (value) => shadowRegex.test(value);
  var isImage = (value) => imageRegex.test(value);
  var isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
  var isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
  var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
  var isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
  var isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
  var isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
  var isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
  var isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
  var isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
  var isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
  var isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
  var isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
  var isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
  var isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
  var isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
  var getIsArbitraryValue = (value, testLabel, testValue) => {
    const result = arbitraryValueRegex.exec(value);
    if (result) {
      if (result[1]) {
        return testLabel(result[1]);
      }
      return testValue(result[2]);
    }
    return false;
  };
  var getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
    const result = arbitraryVariableRegex.exec(value);
    if (result) {
      if (result[1]) {
        return testLabel(result[1]);
      }
      return shouldMatchNoLabel;
    }
    return false;
  };
  var isLabelPosition = (label) => label === "position" || label === "percentage";
  var isLabelImage = (label) => label === "image" || label === "url";
  var isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
  var isLabelLength = (label) => label === "length";
  var isLabelNumber = (label) => label === "number";
  var isLabelFamilyName = (label) => label === "family-name";
  var isLabelShadow = (label) => label === "shadow";
  var getDefaultConfig = () => {
    const themeColor = fromTheme("color");
    const themeFont = fromTheme("font");
    const themeText = fromTheme("text");
    const themeFontWeight = fromTheme("font-weight");
    const themeTracking = fromTheme("tracking");
    const themeLeading = fromTheme("leading");
    const themeBreakpoint = fromTheme("breakpoint");
    const themeContainer = fromTheme("container");
    const themeSpacing = fromTheme("spacing");
    const themeRadius = fromTheme("radius");
    const themeShadow = fromTheme("shadow");
    const themeInsetShadow = fromTheme("inset-shadow");
    const themeTextShadow = fromTheme("text-shadow");
    const themeDropShadow = fromTheme("drop-shadow");
    const themeBlur = fromTheme("blur");
    const themePerspective = fromTheme("perspective");
    const themeAspect = fromTheme("aspect");
    const themeEase = fromTheme("ease");
    const themeAnimate = fromTheme("animate");
    const scaleBreak = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
    const scalePosition = () => [
      "center",
      "top",
      "bottom",
      "left",
      "right",
      "top-left",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "left-top",
      "top-right",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "right-top",
      "bottom-right",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "right-bottom",
      "bottom-left",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "left-bottom"
    ];
    const scalePositionWithArbitrary = () => [...scalePosition(), isArbitraryVariable, isArbitraryValue];
    const scaleOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
    const scaleOverscroll = () => ["auto", "contain", "none"];
    const scaleUnambiguousSpacing = () => [isArbitraryVariable, isArbitraryValue, themeSpacing];
    const scaleInset = () => [isFraction, "full", "auto", ...scaleUnambiguousSpacing()];
    const scaleGridTemplateColsRows = () => [isInteger, "none", "subgrid", isArbitraryVariable, isArbitraryValue];
    const scaleGridColRowStartAndEnd = () => ["auto", {
      span: ["full", isInteger, isArbitraryVariable, isArbitraryValue]
    }, isInteger, isArbitraryVariable, isArbitraryValue];
    const scaleGridColRowStartOrEnd = () => [isInteger, "auto", isArbitraryVariable, isArbitraryValue];
    const scaleGridAutoColsRows = () => ["auto", "min", "max", "fr", isArbitraryVariable, isArbitraryValue];
    const scaleAlignPrimaryAxis = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"];
    const scaleAlignSecondaryAxis = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"];
    const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
    const scaleSizing = () => [isFraction, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...scaleUnambiguousSpacing()];
    const scaleColor = () => [themeColor, isArbitraryVariable, isArbitraryValue];
    const scaleBgPosition = () => [...scalePosition(), isArbitraryVariablePosition, isArbitraryPosition, {
      position: [isArbitraryVariable, isArbitraryValue]
    }];
    const scaleBgRepeat = () => ["no-repeat", {
      repeat: ["", "x", "y", "space", "round"]
    }];
    const scaleBgSize = () => ["auto", "cover", "contain", isArbitraryVariableSize, isArbitrarySize, {
      size: [isArbitraryVariable, isArbitraryValue]
    }];
    const scaleGradientStopPosition = () => [isPercent, isArbitraryVariableLength, isArbitraryLength];
    const scaleRadius = () => [
      // Deprecated since Tailwind CSS v4.0.0
      "",
      "none",
      "full",
      themeRadius,
      isArbitraryVariable,
      isArbitraryValue
    ];
    const scaleBorderWidth = () => ["", isNumber, isArbitraryVariableLength, isArbitraryLength];
    const scaleLineStyle = () => ["solid", "dashed", "dotted", "double"];
    const scaleBlendMode = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
    const scaleMaskImagePosition = () => [isNumber, isPercent, isArbitraryVariablePosition, isArbitraryPosition];
    const scaleBlur = () => [
      // Deprecated since Tailwind CSS v4.0.0
      "",
      "none",
      themeBlur,
      isArbitraryVariable,
      isArbitraryValue
    ];
    const scaleRotate = () => ["none", isNumber, isArbitraryVariable, isArbitraryValue];
    const scaleScale = () => ["none", isNumber, isArbitraryVariable, isArbitraryValue];
    const scaleSkew = () => [isNumber, isArbitraryVariable, isArbitraryValue];
    const scaleTranslate = () => [isFraction, "full", ...scaleUnambiguousSpacing()];
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [isTshirtSize],
        breakpoint: [isTshirtSize],
        color: [isAny],
        container: [isTshirtSize],
        "drop-shadow": [isTshirtSize],
        ease: ["in", "out", "in-out"],
        font: [isAnyNonArbitrary],
        "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
        "inset-shadow": [isTshirtSize],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
        radius: [isTshirtSize],
        shadow: [isTshirtSize],
        spacing: ["px", isNumber],
        text: [isTshirtSize],
        "text-shadow": [isTshirtSize],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
      },
      classGroups: {
        // --------------
        // --- Layout ---
        // --------------
        /**
         * Aspect Ratio
         * @see https://tailwindcss.com/docs/aspect-ratio
         */
        aspect: [{
          aspect: ["auto", "square", isFraction, isArbitraryValue, isArbitraryVariable, themeAspect]
        }],
        /**
         * Container
         * @see https://tailwindcss.com/docs/container
         * @deprecated since Tailwind CSS v4.0.0
         */
        container: ["container"],
        /**
         * Columns
         * @see https://tailwindcss.com/docs/columns
         */
        columns: [{
          columns: [isNumber, isArbitraryValue, isArbitraryVariable, themeContainer]
        }],
        /**
         * Break After
         * @see https://tailwindcss.com/docs/break-after
         */
        "break-after": [{
          "break-after": scaleBreak()
        }],
        /**
         * Break Before
         * @see https://tailwindcss.com/docs/break-before
         */
        "break-before": [{
          "break-before": scaleBreak()
        }],
        /**
         * Break Inside
         * @see https://tailwindcss.com/docs/break-inside
         */
        "break-inside": [{
          "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
        }],
        /**
         * Box Decoration Break
         * @see https://tailwindcss.com/docs/box-decoration-break
         */
        "box-decoration": [{
          "box-decoration": ["slice", "clone"]
        }],
        /**
         * Box Sizing
         * @see https://tailwindcss.com/docs/box-sizing
         */
        box: [{
          box: ["border", "content"]
        }],
        /**
         * Display
         * @see https://tailwindcss.com/docs/display
         */
        display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
        /**
         * Screen Reader Only
         * @see https://tailwindcss.com/docs/display#screen-reader-only
         */
        sr: ["sr-only", "not-sr-only"],
        /**
         * Floats
         * @see https://tailwindcss.com/docs/float
         */
        float: [{
          float: ["right", "left", "none", "start", "end"]
        }],
        /**
         * Clear
         * @see https://tailwindcss.com/docs/clear
         */
        clear: [{
          clear: ["left", "right", "both", "none", "start", "end"]
        }],
        /**
         * Isolation
         * @see https://tailwindcss.com/docs/isolation
         */
        isolation: ["isolate", "isolation-auto"],
        /**
         * Object Fit
         * @see https://tailwindcss.com/docs/object-fit
         */
        "object-fit": [{
          object: ["contain", "cover", "fill", "none", "scale-down"]
        }],
        /**
         * Object Position
         * @see https://tailwindcss.com/docs/object-position
         */
        "object-position": [{
          object: scalePositionWithArbitrary()
        }],
        /**
         * Overflow
         * @see https://tailwindcss.com/docs/overflow
         */
        overflow: [{
          overflow: scaleOverflow()
        }],
        /**
         * Overflow X
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-x": [{
          "overflow-x": scaleOverflow()
        }],
        /**
         * Overflow Y
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-y": [{
          "overflow-y": scaleOverflow()
        }],
        /**
         * Overscroll Behavior
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        overscroll: [{
          overscroll: scaleOverscroll()
        }],
        /**
         * Overscroll Behavior X
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-x": [{
          "overscroll-x": scaleOverscroll()
        }],
        /**
         * Overscroll Behavior Y
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-y": [{
          "overscroll-y": scaleOverscroll()
        }],
        /**
         * Position
         * @see https://tailwindcss.com/docs/position
         */
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        /**
         * Top / Right / Bottom / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        inset: [{
          inset: scaleInset()
        }],
        /**
         * Right / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-x": [{
          "inset-x": scaleInset()
        }],
        /**
         * Top / Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-y": [{
          "inset-y": scaleInset()
        }],
        /**
         * Start
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        start: [{
          start: scaleInset()
        }],
        /**
         * End
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        end: [{
          end: scaleInset()
        }],
        /**
         * Top
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        top: [{
          top: scaleInset()
        }],
        /**
         * Right
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        right: [{
          right: scaleInset()
        }],
        /**
         * Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        bottom: [{
          bottom: scaleInset()
        }],
        /**
         * Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        left: [{
          left: scaleInset()
        }],
        /**
         * Visibility
         * @see https://tailwindcss.com/docs/visibility
         */
        visibility: ["visible", "invisible", "collapse"],
        /**
         * Z-Index
         * @see https://tailwindcss.com/docs/z-index
         */
        z: [{
          z: [isInteger, "auto", isArbitraryVariable, isArbitraryValue]
        }],
        // ------------------------
        // --- Flexbox and Grid ---
        // ------------------------
        /**
         * Flex Basis
         * @see https://tailwindcss.com/docs/flex-basis
         */
        basis: [{
          basis: [isFraction, "full", "auto", themeContainer, ...scaleUnambiguousSpacing()]
        }],
        /**
         * Flex Direction
         * @see https://tailwindcss.com/docs/flex-direction
         */
        "flex-direction": [{
          flex: ["row", "row-reverse", "col", "col-reverse"]
        }],
        /**
         * Flex Wrap
         * @see https://tailwindcss.com/docs/flex-wrap
         */
        "flex-wrap": [{
          flex: ["nowrap", "wrap", "wrap-reverse"]
        }],
        /**
         * Flex
         * @see https://tailwindcss.com/docs/flex
         */
        flex: [{
          flex: [isNumber, isFraction, "auto", "initial", "none", isArbitraryValue]
        }],
        /**
         * Flex Grow
         * @see https://tailwindcss.com/docs/flex-grow
         */
        grow: [{
          grow: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Flex Shrink
         * @see https://tailwindcss.com/docs/flex-shrink
         */
        shrink: [{
          shrink: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Order
         * @see https://tailwindcss.com/docs/order
         */
        order: [{
          order: [isInteger, "first", "last", "none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Grid Template Columns
         * @see https://tailwindcss.com/docs/grid-template-columns
         */
        "grid-cols": [{
          "grid-cols": scaleGridTemplateColsRows()
        }],
        /**
         * Grid Column Start / End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start-end": [{
          col: scaleGridColRowStartAndEnd()
        }],
        /**
         * Grid Column Start
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start": [{
          "col-start": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Column End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-end": [{
          "col-end": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Template Rows
         * @see https://tailwindcss.com/docs/grid-template-rows
         */
        "grid-rows": [{
          "grid-rows": scaleGridTemplateColsRows()
        }],
        /**
         * Grid Row Start / End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start-end": [{
          row: scaleGridColRowStartAndEnd()
        }],
        /**
         * Grid Row Start
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start": [{
          "row-start": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Row End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-end": [{
          "row-end": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Auto Flow
         * @see https://tailwindcss.com/docs/grid-auto-flow
         */
        "grid-flow": [{
          "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
        }],
        /**
         * Grid Auto Columns
         * @see https://tailwindcss.com/docs/grid-auto-columns
         */
        "auto-cols": [{
          "auto-cols": scaleGridAutoColsRows()
        }],
        /**
         * Grid Auto Rows
         * @see https://tailwindcss.com/docs/grid-auto-rows
         */
        "auto-rows": [{
          "auto-rows": scaleGridAutoColsRows()
        }],
        /**
         * Gap
         * @see https://tailwindcss.com/docs/gap
         */
        gap: [{
          gap: scaleUnambiguousSpacing()
        }],
        /**
         * Gap X
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-x": [{
          "gap-x": scaleUnambiguousSpacing()
        }],
        /**
         * Gap Y
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-y": [{
          "gap-y": scaleUnambiguousSpacing()
        }],
        /**
         * Justify Content
         * @see https://tailwindcss.com/docs/justify-content
         */
        "justify-content": [{
          justify: [...scaleAlignPrimaryAxis(), "normal"]
        }],
        /**
         * Justify Items
         * @see https://tailwindcss.com/docs/justify-items
         */
        "justify-items": [{
          "justify-items": [...scaleAlignSecondaryAxis(), "normal"]
        }],
        /**
         * Justify Self
         * @see https://tailwindcss.com/docs/justify-self
         */
        "justify-self": [{
          "justify-self": ["auto", ...scaleAlignSecondaryAxis()]
        }],
        /**
         * Align Content
         * @see https://tailwindcss.com/docs/align-content
         */
        "align-content": [{
          content: ["normal", ...scaleAlignPrimaryAxis()]
        }],
        /**
         * Align Items
         * @see https://tailwindcss.com/docs/align-items
         */
        "align-items": [{
          items: [...scaleAlignSecondaryAxis(), {
            baseline: ["", "last"]
          }]
        }],
        /**
         * Align Self
         * @see https://tailwindcss.com/docs/align-self
         */
        "align-self": [{
          self: ["auto", ...scaleAlignSecondaryAxis(), {
            baseline: ["", "last"]
          }]
        }],
        /**
         * Place Content
         * @see https://tailwindcss.com/docs/place-content
         */
        "place-content": [{
          "place-content": scaleAlignPrimaryAxis()
        }],
        /**
         * Place Items
         * @see https://tailwindcss.com/docs/place-items
         */
        "place-items": [{
          "place-items": [...scaleAlignSecondaryAxis(), "baseline"]
        }],
        /**
         * Place Self
         * @see https://tailwindcss.com/docs/place-self
         */
        "place-self": [{
          "place-self": ["auto", ...scaleAlignSecondaryAxis()]
        }],
        // Spacing
        /**
         * Padding
         * @see https://tailwindcss.com/docs/padding
         */
        p: [{
          p: scaleUnambiguousSpacing()
        }],
        /**
         * Padding X
         * @see https://tailwindcss.com/docs/padding
         */
        px: [{
          px: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Y
         * @see https://tailwindcss.com/docs/padding
         */
        py: [{
          py: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Start
         * @see https://tailwindcss.com/docs/padding
         */
        ps: [{
          ps: scaleUnambiguousSpacing()
        }],
        /**
         * Padding End
         * @see https://tailwindcss.com/docs/padding
         */
        pe: [{
          pe: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Top
         * @see https://tailwindcss.com/docs/padding
         */
        pt: [{
          pt: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Right
         * @see https://tailwindcss.com/docs/padding
         */
        pr: [{
          pr: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Bottom
         * @see https://tailwindcss.com/docs/padding
         */
        pb: [{
          pb: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Left
         * @see https://tailwindcss.com/docs/padding
         */
        pl: [{
          pl: scaleUnambiguousSpacing()
        }],
        /**
         * Margin
         * @see https://tailwindcss.com/docs/margin
         */
        m: [{
          m: scaleMargin()
        }],
        /**
         * Margin X
         * @see https://tailwindcss.com/docs/margin
         */
        mx: [{
          mx: scaleMargin()
        }],
        /**
         * Margin Y
         * @see https://tailwindcss.com/docs/margin
         */
        my: [{
          my: scaleMargin()
        }],
        /**
         * Margin Start
         * @see https://tailwindcss.com/docs/margin
         */
        ms: [{
          ms: scaleMargin()
        }],
        /**
         * Margin End
         * @see https://tailwindcss.com/docs/margin
         */
        me: [{
          me: scaleMargin()
        }],
        /**
         * Margin Top
         * @see https://tailwindcss.com/docs/margin
         */
        mt: [{
          mt: scaleMargin()
        }],
        /**
         * Margin Right
         * @see https://tailwindcss.com/docs/margin
         */
        mr: [{
          mr: scaleMargin()
        }],
        /**
         * Margin Bottom
         * @see https://tailwindcss.com/docs/margin
         */
        mb: [{
          mb: scaleMargin()
        }],
        /**
         * Margin Left
         * @see https://tailwindcss.com/docs/margin
         */
        ml: [{
          ml: scaleMargin()
        }],
        /**
         * Space Between X
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-x": [{
          "space-x": scaleUnambiguousSpacing()
        }],
        /**
         * Space Between X Reverse
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-x-reverse": ["space-x-reverse"],
        /**
         * Space Between Y
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-y": [{
          "space-y": scaleUnambiguousSpacing()
        }],
        /**
         * Space Between Y Reverse
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-y-reverse": ["space-y-reverse"],
        // --------------
        // --- Sizing ---
        // --------------
        /**
         * Size
         * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
         */
        size: [{
          size: scaleSizing()
        }],
        /**
         * Width
         * @see https://tailwindcss.com/docs/width
         */
        w: [{
          w: [themeContainer, "screen", ...scaleSizing()]
        }],
        /**
         * Min-Width
         * @see https://tailwindcss.com/docs/min-width
         */
        "min-w": [{
          "min-w": [
            themeContainer,
            "screen",
            /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            "none",
            ...scaleSizing()
          ]
        }],
        /**
         * Max-Width
         * @see https://tailwindcss.com/docs/max-width
         */
        "max-w": [{
          "max-w": [
            themeContainer,
            "screen",
            "none",
            /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            "prose",
            /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            {
              screen: [themeBreakpoint]
            },
            ...scaleSizing()
          ]
        }],
        /**
         * Height
         * @see https://tailwindcss.com/docs/height
         */
        h: [{
          h: ["screen", "lh", ...scaleSizing()]
        }],
        /**
         * Min-Height
         * @see https://tailwindcss.com/docs/min-height
         */
        "min-h": [{
          "min-h": ["screen", "lh", "none", ...scaleSizing()]
        }],
        /**
         * Max-Height
         * @see https://tailwindcss.com/docs/max-height
         */
        "max-h": [{
          "max-h": ["screen", "lh", ...scaleSizing()]
        }],
        // ------------------
        // --- Typography ---
        // ------------------
        /**
         * Font Size
         * @see https://tailwindcss.com/docs/font-size
         */
        "font-size": [{
          text: ["base", themeText, isArbitraryVariableLength, isArbitraryLength]
        }],
        /**
         * Font Smoothing
         * @see https://tailwindcss.com/docs/font-smoothing
         */
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        /**
         * Font Style
         * @see https://tailwindcss.com/docs/font-style
         */
        "font-style": ["italic", "not-italic"],
        /**
         * Font Weight
         * @see https://tailwindcss.com/docs/font-weight
         */
        "font-weight": [{
          font: [themeFontWeight, isArbitraryVariable, isArbitraryNumber]
        }],
        /**
         * Font Stretch
         * @see https://tailwindcss.com/docs/font-stretch
         */
        "font-stretch": [{
          "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", isPercent, isArbitraryValue]
        }],
        /**
         * Font Family
         * @see https://tailwindcss.com/docs/font-family
         */
        "font-family": [{
          font: [isArbitraryVariableFamilyName, isArbitraryValue, themeFont]
        }],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-normal": ["normal-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-ordinal": ["ordinal"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-slashed-zero": ["slashed-zero"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        /**
         * Letter Spacing
         * @see https://tailwindcss.com/docs/letter-spacing
         */
        tracking: [{
          tracking: [themeTracking, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Line Clamp
         * @see https://tailwindcss.com/docs/line-clamp
         */
        "line-clamp": [{
          "line-clamp": [isNumber, "none", isArbitraryVariable, isArbitraryNumber]
        }],
        /**
         * Line Height
         * @see https://tailwindcss.com/docs/line-height
         */
        leading: [{
          leading: [
            /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            themeLeading,
            ...scaleUnambiguousSpacing()
          ]
        }],
        /**
         * List Style Image
         * @see https://tailwindcss.com/docs/list-style-image
         */
        "list-image": [{
          "list-image": ["none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * List Style Position
         * @see https://tailwindcss.com/docs/list-style-position
         */
        "list-style-position": [{
          list: ["inside", "outside"]
        }],
        /**
         * List Style Type
         * @see https://tailwindcss.com/docs/list-style-type
         */
        "list-style-type": [{
          list: ["disc", "decimal", "none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Text Alignment
         * @see https://tailwindcss.com/docs/text-align
         */
        "text-alignment": [{
          text: ["left", "center", "right", "justify", "start", "end"]
        }],
        /**
         * Placeholder Color
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://v3.tailwindcss.com/docs/placeholder-color
         */
        "placeholder-color": [{
          placeholder: scaleColor()
        }],
        /**
         * Text Color
         * @see https://tailwindcss.com/docs/text-color
         */
        "text-color": [{
          text: scaleColor()
        }],
        /**
         * Text Decoration
         * @see https://tailwindcss.com/docs/text-decoration
         */
        "text-decoration": ["underline", "overline", "line-through", "no-underline"],
        /**
         * Text Decoration Style
         * @see https://tailwindcss.com/docs/text-decoration-style
         */
        "text-decoration-style": [{
          decoration: [...scaleLineStyle(), "wavy"]
        }],
        /**
         * Text Decoration Thickness
         * @see https://tailwindcss.com/docs/text-decoration-thickness
         */
        "text-decoration-thickness": [{
          decoration: [isNumber, "from-font", "auto", isArbitraryVariable, isArbitraryLength]
        }],
        /**
         * Text Decoration Color
         * @see https://tailwindcss.com/docs/text-decoration-color
         */
        "text-decoration-color": [{
          decoration: scaleColor()
        }],
        /**
         * Text Underline Offset
         * @see https://tailwindcss.com/docs/text-underline-offset
         */
        "underline-offset": [{
          "underline-offset": [isNumber, "auto", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Text Transform
         * @see https://tailwindcss.com/docs/text-transform
         */
        "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
        /**
         * Text Overflow
         * @see https://tailwindcss.com/docs/text-overflow
         */
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        /**
         * Text Wrap
         * @see https://tailwindcss.com/docs/text-wrap
         */
        "text-wrap": [{
          text: ["wrap", "nowrap", "balance", "pretty"]
        }],
        /**
         * Text Indent
         * @see https://tailwindcss.com/docs/text-indent
         */
        indent: [{
          indent: scaleUnambiguousSpacing()
        }],
        /**
         * Vertical Alignment
         * @see https://tailwindcss.com/docs/vertical-align
         */
        "vertical-align": [{
          align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Whitespace
         * @see https://tailwindcss.com/docs/whitespace
         */
        whitespace: [{
          whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
        }],
        /**
         * Word Break
         * @see https://tailwindcss.com/docs/word-break
         */
        break: [{
          break: ["normal", "words", "all", "keep"]
        }],
        /**
         * Overflow Wrap
         * @see https://tailwindcss.com/docs/overflow-wrap
         */
        wrap: [{
          wrap: ["break-word", "anywhere", "normal"]
        }],
        /**
         * Hyphens
         * @see https://tailwindcss.com/docs/hyphens
         */
        hyphens: [{
          hyphens: ["none", "manual", "auto"]
        }],
        /**
         * Content
         * @see https://tailwindcss.com/docs/content
         */
        content: [{
          content: ["none", isArbitraryVariable, isArbitraryValue]
        }],
        // -------------------
        // --- Backgrounds ---
        // -------------------
        /**
         * Background Attachment
         * @see https://tailwindcss.com/docs/background-attachment
         */
        "bg-attachment": [{
          bg: ["fixed", "local", "scroll"]
        }],
        /**
         * Background Clip
         * @see https://tailwindcss.com/docs/background-clip
         */
        "bg-clip": [{
          "bg-clip": ["border", "padding", "content", "text"]
        }],
        /**
         * Background Origin
         * @see https://tailwindcss.com/docs/background-origin
         */
        "bg-origin": [{
          "bg-origin": ["border", "padding", "content"]
        }],
        /**
         * Background Position
         * @see https://tailwindcss.com/docs/background-position
         */
        "bg-position": [{
          bg: scaleBgPosition()
        }],
        /**
         * Background Repeat
         * @see https://tailwindcss.com/docs/background-repeat
         */
        "bg-repeat": [{
          bg: scaleBgRepeat()
        }],
        /**
         * Background Size
         * @see https://tailwindcss.com/docs/background-size
         */
        "bg-size": [{
          bg: scaleBgSize()
        }],
        /**
         * Background Image
         * @see https://tailwindcss.com/docs/background-image
         */
        "bg-image": [{
          bg: ["none", {
            linear: [{
              to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
            }, isInteger, isArbitraryVariable, isArbitraryValue],
            radial: ["", isArbitraryVariable, isArbitraryValue],
            conic: [isInteger, isArbitraryVariable, isArbitraryValue]
          }, isArbitraryVariableImage, isArbitraryImage]
        }],
        /**
         * Background Color
         * @see https://tailwindcss.com/docs/background-color
         */
        "bg-color": [{
          bg: scaleColor()
        }],
        /**
         * Gradient Color Stops From Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from-pos": [{
          from: scaleGradientStopPosition()
        }],
        /**
         * Gradient Color Stops Via Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via-pos": [{
          via: scaleGradientStopPosition()
        }],
        /**
         * Gradient Color Stops To Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to-pos": [{
          to: scaleGradientStopPosition()
        }],
        /**
         * Gradient Color Stops From
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from": [{
          from: scaleColor()
        }],
        /**
         * Gradient Color Stops Via
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via": [{
          via: scaleColor()
        }],
        /**
         * Gradient Color Stops To
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to": [{
          to: scaleColor()
        }],
        // ---------------
        // --- Borders ---
        // ---------------
        /**
         * Border Radius
         * @see https://tailwindcss.com/docs/border-radius
         */
        rounded: [{
          rounded: scaleRadius()
        }],
        /**
         * Border Radius Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-s": [{
          "rounded-s": scaleRadius()
        }],
        /**
         * Border Radius End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-e": [{
          "rounded-e": scaleRadius()
        }],
        /**
         * Border Radius Top
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-t": [{
          "rounded-t": scaleRadius()
        }],
        /**
         * Border Radius Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-r": [{
          "rounded-r": scaleRadius()
        }],
        /**
         * Border Radius Bottom
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-b": [{
          "rounded-b": scaleRadius()
        }],
        /**
         * Border Radius Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-l": [{
          "rounded-l": scaleRadius()
        }],
        /**
         * Border Radius Start Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ss": [{
          "rounded-ss": scaleRadius()
        }],
        /**
         * Border Radius Start End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-se": [{
          "rounded-se": scaleRadius()
        }],
        /**
         * Border Radius End End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ee": [{
          "rounded-ee": scaleRadius()
        }],
        /**
         * Border Radius End Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-es": [{
          "rounded-es": scaleRadius()
        }],
        /**
         * Border Radius Top Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tl": [{
          "rounded-tl": scaleRadius()
        }],
        /**
         * Border Radius Top Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tr": [{
          "rounded-tr": scaleRadius()
        }],
        /**
         * Border Radius Bottom Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-br": [{
          "rounded-br": scaleRadius()
        }],
        /**
         * Border Radius Bottom Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-bl": [{
          "rounded-bl": scaleRadius()
        }],
        /**
         * Border Width
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w": [{
          border: scaleBorderWidth()
        }],
        /**
         * Border Width X
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-x": [{
          "border-x": scaleBorderWidth()
        }],
        /**
         * Border Width Y
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-y": [{
          "border-y": scaleBorderWidth()
        }],
        /**
         * Border Width Start
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-s": [{
          "border-s": scaleBorderWidth()
        }],
        /**
         * Border Width End
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-e": [{
          "border-e": scaleBorderWidth()
        }],
        /**
         * Border Width Top
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-t": [{
          "border-t": scaleBorderWidth()
        }],
        /**
         * Border Width Right
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-r": [{
          "border-r": scaleBorderWidth()
        }],
        /**
         * Border Width Bottom
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-b": [{
          "border-b": scaleBorderWidth()
        }],
        /**
         * Border Width Left
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-l": [{
          "border-l": scaleBorderWidth()
        }],
        /**
         * Divide Width X
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-x": [{
          "divide-x": scaleBorderWidth()
        }],
        /**
         * Divide Width X Reverse
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-x-reverse": ["divide-x-reverse"],
        /**
         * Divide Width Y
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-y": [{
          "divide-y": scaleBorderWidth()
        }],
        /**
         * Divide Width Y Reverse
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-y-reverse": ["divide-y-reverse"],
        /**
         * Border Style
         * @see https://tailwindcss.com/docs/border-style
         */
        "border-style": [{
          border: [...scaleLineStyle(), "hidden", "none"]
        }],
        /**
         * Divide Style
         * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
         */
        "divide-style": [{
          divide: [...scaleLineStyle(), "hidden", "none"]
        }],
        /**
         * Border Color
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color": [{
          border: scaleColor()
        }],
        /**
         * Border Color X
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-x": [{
          "border-x": scaleColor()
        }],
        /**
         * Border Color Y
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-y": [{
          "border-y": scaleColor()
        }],
        /**
         * Border Color S
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-s": [{
          "border-s": scaleColor()
        }],
        /**
         * Border Color E
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-e": [{
          "border-e": scaleColor()
        }],
        /**
         * Border Color Top
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-t": [{
          "border-t": scaleColor()
        }],
        /**
         * Border Color Right
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-r": [{
          "border-r": scaleColor()
        }],
        /**
         * Border Color Bottom
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-b": [{
          "border-b": scaleColor()
        }],
        /**
         * Border Color Left
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-l": [{
          "border-l": scaleColor()
        }],
        /**
         * Divide Color
         * @see https://tailwindcss.com/docs/divide-color
         */
        "divide-color": [{
          divide: scaleColor()
        }],
        /**
         * Outline Style
         * @see https://tailwindcss.com/docs/outline-style
         */
        "outline-style": [{
          outline: [...scaleLineStyle(), "none", "hidden"]
        }],
        /**
         * Outline Offset
         * @see https://tailwindcss.com/docs/outline-offset
         */
        "outline-offset": [{
          "outline-offset": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Outline Width
         * @see https://tailwindcss.com/docs/outline-width
         */
        "outline-w": [{
          outline: ["", isNumber, isArbitraryVariableLength, isArbitraryLength]
        }],
        /**
         * Outline Color
         * @see https://tailwindcss.com/docs/outline-color
         */
        "outline-color": [{
          outline: scaleColor()
        }],
        // ---------------
        // --- Effects ---
        // ---------------
        /**
         * Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow
         */
        shadow: [{
          shadow: [
            // Deprecated since Tailwind CSS v4.0.0
            "",
            "none",
            themeShadow,
            isArbitraryVariableShadow,
            isArbitraryShadow
          ]
        }],
        /**
         * Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
         */
        "shadow-color": [{
          shadow: scaleColor()
        }],
        /**
         * Inset Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
         */
        "inset-shadow": [{
          "inset-shadow": ["none", themeInsetShadow, isArbitraryVariableShadow, isArbitraryShadow]
        }],
        /**
         * Inset Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
         */
        "inset-shadow-color": [{
          "inset-shadow": scaleColor()
        }],
        /**
         * Ring Width
         * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
         */
        "ring-w": [{
          ring: scaleBorderWidth()
        }],
        /**
         * Ring Width Inset
         * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        "ring-w-inset": ["ring-inset"],
        /**
         * Ring Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
         */
        "ring-color": [{
          ring: scaleColor()
        }],
        /**
         * Ring Offset Width
         * @see https://v3.tailwindcss.com/docs/ring-offset-width
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        "ring-offset-w": [{
          "ring-offset": [isNumber, isArbitraryLength]
        }],
        /**
         * Ring Offset Color
         * @see https://v3.tailwindcss.com/docs/ring-offset-color
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        "ring-offset-color": [{
          "ring-offset": scaleColor()
        }],
        /**
         * Inset Ring Width
         * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
         */
        "inset-ring-w": [{
          "inset-ring": scaleBorderWidth()
        }],
        /**
         * Inset Ring Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
         */
        "inset-ring-color": [{
          "inset-ring": scaleColor()
        }],
        /**
         * Text Shadow
         * @see https://tailwindcss.com/docs/text-shadow
         */
        "text-shadow": [{
          "text-shadow": ["none", themeTextShadow, isArbitraryVariableShadow, isArbitraryShadow]
        }],
        /**
         * Text Shadow Color
         * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
         */
        "text-shadow-color": [{
          "text-shadow": scaleColor()
        }],
        /**
         * Opacity
         * @see https://tailwindcss.com/docs/opacity
         */
        opacity: [{
          opacity: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Mix Blend Mode
         * @see https://tailwindcss.com/docs/mix-blend-mode
         */
        "mix-blend": [{
          "mix-blend": [...scaleBlendMode(), "plus-darker", "plus-lighter"]
        }],
        /**
         * Background Blend Mode
         * @see https://tailwindcss.com/docs/background-blend-mode
         */
        "bg-blend": [{
          "bg-blend": scaleBlendMode()
        }],
        /**
         * Mask Clip
         * @see https://tailwindcss.com/docs/mask-clip
         */
        "mask-clip": [{
          "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
        }, "mask-no-clip"],
        /**
         * Mask Composite
         * @see https://tailwindcss.com/docs/mask-composite
         */
        "mask-composite": [{
          mask: ["add", "subtract", "intersect", "exclude"]
        }],
        /**
         * Mask Image
         * @see https://tailwindcss.com/docs/mask-image
         */
        "mask-image-linear-pos": [{
          "mask-linear": [isNumber]
        }],
        "mask-image-linear-from-pos": [{
          "mask-linear-from": scaleMaskImagePosition()
        }],
        "mask-image-linear-to-pos": [{
          "mask-linear-to": scaleMaskImagePosition()
        }],
        "mask-image-linear-from-color": [{
          "mask-linear-from": scaleColor()
        }],
        "mask-image-linear-to-color": [{
          "mask-linear-to": scaleColor()
        }],
        "mask-image-t-from-pos": [{
          "mask-t-from": scaleMaskImagePosition()
        }],
        "mask-image-t-to-pos": [{
          "mask-t-to": scaleMaskImagePosition()
        }],
        "mask-image-t-from-color": [{
          "mask-t-from": scaleColor()
        }],
        "mask-image-t-to-color": [{
          "mask-t-to": scaleColor()
        }],
        "mask-image-r-from-pos": [{
          "mask-r-from": scaleMaskImagePosition()
        }],
        "mask-image-r-to-pos": [{
          "mask-r-to": scaleMaskImagePosition()
        }],
        "mask-image-r-from-color": [{
          "mask-r-from": scaleColor()
        }],
        "mask-image-r-to-color": [{
          "mask-r-to": scaleColor()
        }],
        "mask-image-b-from-pos": [{
          "mask-b-from": scaleMaskImagePosition()
        }],
        "mask-image-b-to-pos": [{
          "mask-b-to": scaleMaskImagePosition()
        }],
        "mask-image-b-from-color": [{
          "mask-b-from": scaleColor()
        }],
        "mask-image-b-to-color": [{
          "mask-b-to": scaleColor()
        }],
        "mask-image-l-from-pos": [{
          "mask-l-from": scaleMaskImagePosition()
        }],
        "mask-image-l-to-pos": [{
          "mask-l-to": scaleMaskImagePosition()
        }],
        "mask-image-l-from-color": [{
          "mask-l-from": scaleColor()
        }],
        "mask-image-l-to-color": [{
          "mask-l-to": scaleColor()
        }],
        "mask-image-x-from-pos": [{
          "mask-x-from": scaleMaskImagePosition()
        }],
        "mask-image-x-to-pos": [{
          "mask-x-to": scaleMaskImagePosition()
        }],
        "mask-image-x-from-color": [{
          "mask-x-from": scaleColor()
        }],
        "mask-image-x-to-color": [{
          "mask-x-to": scaleColor()
        }],
        "mask-image-y-from-pos": [{
          "mask-y-from": scaleMaskImagePosition()
        }],
        "mask-image-y-to-pos": [{
          "mask-y-to": scaleMaskImagePosition()
        }],
        "mask-image-y-from-color": [{
          "mask-y-from": scaleColor()
        }],
        "mask-image-y-to-color": [{
          "mask-y-to": scaleColor()
        }],
        "mask-image-radial": [{
          "mask-radial": [isArbitraryVariable, isArbitraryValue]
        }],
        "mask-image-radial-from-pos": [{
          "mask-radial-from": scaleMaskImagePosition()
        }],
        "mask-image-radial-to-pos": [{
          "mask-radial-to": scaleMaskImagePosition()
        }],
        "mask-image-radial-from-color": [{
          "mask-radial-from": scaleColor()
        }],
        "mask-image-radial-to-color": [{
          "mask-radial-to": scaleColor()
        }],
        "mask-image-radial-shape": [{
          "mask-radial": ["circle", "ellipse"]
        }],
        "mask-image-radial-size": [{
          "mask-radial": [{
            closest: ["side", "corner"],
            farthest: ["side", "corner"]
          }]
        }],
        "mask-image-radial-pos": [{
          "mask-radial-at": scalePosition()
        }],
        "mask-image-conic-pos": [{
          "mask-conic": [isNumber]
        }],
        "mask-image-conic-from-pos": [{
          "mask-conic-from": scaleMaskImagePosition()
        }],
        "mask-image-conic-to-pos": [{
          "mask-conic-to": scaleMaskImagePosition()
        }],
        "mask-image-conic-from-color": [{
          "mask-conic-from": scaleColor()
        }],
        "mask-image-conic-to-color": [{
          "mask-conic-to": scaleColor()
        }],
        /**
         * Mask Mode
         * @see https://tailwindcss.com/docs/mask-mode
         */
        "mask-mode": [{
          mask: ["alpha", "luminance", "match"]
        }],
        /**
         * Mask Origin
         * @see https://tailwindcss.com/docs/mask-origin
         */
        "mask-origin": [{
          "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
        }],
        /**
         * Mask Position
         * @see https://tailwindcss.com/docs/mask-position
         */
        "mask-position": [{
          mask: scaleBgPosition()
        }],
        /**
         * Mask Repeat
         * @see https://tailwindcss.com/docs/mask-repeat
         */
        "mask-repeat": [{
          mask: scaleBgRepeat()
        }],
        /**
         * Mask Size
         * @see https://tailwindcss.com/docs/mask-size
         */
        "mask-size": [{
          mask: scaleBgSize()
        }],
        /**
         * Mask Type
         * @see https://tailwindcss.com/docs/mask-type
         */
        "mask-type": [{
          "mask-type": ["alpha", "luminance"]
        }],
        /**
         * Mask Image
         * @see https://tailwindcss.com/docs/mask-image
         */
        "mask-image": [{
          mask: ["none", isArbitraryVariable, isArbitraryValue]
        }],
        // ---------------
        // --- Filters ---
        // ---------------
        /**
         * Filter
         * @see https://tailwindcss.com/docs/filter
         */
        filter: [{
          filter: [
            // Deprecated since Tailwind CSS v3.0.0
            "",
            "none",
            isArbitraryVariable,
            isArbitraryValue
          ]
        }],
        /**
         * Blur
         * @see https://tailwindcss.com/docs/blur
         */
        blur: [{
          blur: scaleBlur()
        }],
        /**
         * Brightness
         * @see https://tailwindcss.com/docs/brightness
         */
        brightness: [{
          brightness: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Contrast
         * @see https://tailwindcss.com/docs/contrast
         */
        contrast: [{
          contrast: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Drop Shadow
         * @see https://tailwindcss.com/docs/drop-shadow
         */
        "drop-shadow": [{
          "drop-shadow": [
            // Deprecated since Tailwind CSS v4.0.0
            "",
            "none",
            themeDropShadow,
            isArbitraryVariableShadow,
            isArbitraryShadow
          ]
        }],
        /**
         * Drop Shadow Color
         * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
         */
        "drop-shadow-color": [{
          "drop-shadow": scaleColor()
        }],
        /**
         * Grayscale
         * @see https://tailwindcss.com/docs/grayscale
         */
        grayscale: [{
          grayscale: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Hue Rotate
         * @see https://tailwindcss.com/docs/hue-rotate
         */
        "hue-rotate": [{
          "hue-rotate": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Invert
         * @see https://tailwindcss.com/docs/invert
         */
        invert: [{
          invert: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Saturate
         * @see https://tailwindcss.com/docs/saturate
         */
        saturate: [{
          saturate: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Sepia
         * @see https://tailwindcss.com/docs/sepia
         */
        sepia: [{
          sepia: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Filter
         * @see https://tailwindcss.com/docs/backdrop-filter
         */
        "backdrop-filter": [{
          "backdrop-filter": [
            // Deprecated since Tailwind CSS v3.0.0
            "",
            "none",
            isArbitraryVariable,
            isArbitraryValue
          ]
        }],
        /**
         * Backdrop Blur
         * @see https://tailwindcss.com/docs/backdrop-blur
         */
        "backdrop-blur": [{
          "backdrop-blur": scaleBlur()
        }],
        /**
         * Backdrop Brightness
         * @see https://tailwindcss.com/docs/backdrop-brightness
         */
        "backdrop-brightness": [{
          "backdrop-brightness": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Contrast
         * @see https://tailwindcss.com/docs/backdrop-contrast
         */
        "backdrop-contrast": [{
          "backdrop-contrast": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Grayscale
         * @see https://tailwindcss.com/docs/backdrop-grayscale
         */
        "backdrop-grayscale": [{
          "backdrop-grayscale": ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Hue Rotate
         * @see https://tailwindcss.com/docs/backdrop-hue-rotate
         */
        "backdrop-hue-rotate": [{
          "backdrop-hue-rotate": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Invert
         * @see https://tailwindcss.com/docs/backdrop-invert
         */
        "backdrop-invert": [{
          "backdrop-invert": ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Opacity
         * @see https://tailwindcss.com/docs/backdrop-opacity
         */
        "backdrop-opacity": [{
          "backdrop-opacity": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Saturate
         * @see https://tailwindcss.com/docs/backdrop-saturate
         */
        "backdrop-saturate": [{
          "backdrop-saturate": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Sepia
         * @see https://tailwindcss.com/docs/backdrop-sepia
         */
        "backdrop-sepia": [{
          "backdrop-sepia": ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        // --------------
        // --- Tables ---
        // --------------
        /**
         * Border Collapse
         * @see https://tailwindcss.com/docs/border-collapse
         */
        "border-collapse": [{
          border: ["collapse", "separate"]
        }],
        /**
         * Border Spacing
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing": [{
          "border-spacing": scaleUnambiguousSpacing()
        }],
        /**
         * Border Spacing X
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-x": [{
          "border-spacing-x": scaleUnambiguousSpacing()
        }],
        /**
         * Border Spacing Y
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-y": [{
          "border-spacing-y": scaleUnambiguousSpacing()
        }],
        /**
         * Table Layout
         * @see https://tailwindcss.com/docs/table-layout
         */
        "table-layout": [{
          table: ["auto", "fixed"]
        }],
        /**
         * Caption Side
         * @see https://tailwindcss.com/docs/caption-side
         */
        caption: [{
          caption: ["top", "bottom"]
        }],
        // ---------------------------------
        // --- Transitions and Animation ---
        // ---------------------------------
        /**
         * Transition Property
         * @see https://tailwindcss.com/docs/transition-property
         */
        transition: [{
          transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Transition Behavior
         * @see https://tailwindcss.com/docs/transition-behavior
         */
        "transition-behavior": [{
          transition: ["normal", "discrete"]
        }],
        /**
         * Transition Duration
         * @see https://tailwindcss.com/docs/transition-duration
         */
        duration: [{
          duration: [isNumber, "initial", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Transition Timing Function
         * @see https://tailwindcss.com/docs/transition-timing-function
         */
        ease: [{
          ease: ["linear", "initial", themeEase, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Transition Delay
         * @see https://tailwindcss.com/docs/transition-delay
         */
        delay: [{
          delay: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Animation
         * @see https://tailwindcss.com/docs/animation
         */
        animate: [{
          animate: ["none", themeAnimate, isArbitraryVariable, isArbitraryValue]
        }],
        // ------------------
        // --- Transforms ---
        // ------------------
        /**
         * Backface Visibility
         * @see https://tailwindcss.com/docs/backface-visibility
         */
        backface: [{
          backface: ["hidden", "visible"]
        }],
        /**
         * Perspective
         * @see https://tailwindcss.com/docs/perspective
         */
        perspective: [{
          perspective: [themePerspective, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Perspective Origin
         * @see https://tailwindcss.com/docs/perspective-origin
         */
        "perspective-origin": [{
          "perspective-origin": scalePositionWithArbitrary()
        }],
        /**
         * Rotate
         * @see https://tailwindcss.com/docs/rotate
         */
        rotate: [{
          rotate: scaleRotate()
        }],
        /**
         * Rotate X
         * @see https://tailwindcss.com/docs/rotate
         */
        "rotate-x": [{
          "rotate-x": scaleRotate()
        }],
        /**
         * Rotate Y
         * @see https://tailwindcss.com/docs/rotate
         */
        "rotate-y": [{
          "rotate-y": scaleRotate()
        }],
        /**
         * Rotate Z
         * @see https://tailwindcss.com/docs/rotate
         */
        "rotate-z": [{
          "rotate-z": scaleRotate()
        }],
        /**
         * Scale
         * @see https://tailwindcss.com/docs/scale
         */
        scale: [{
          scale: scaleScale()
        }],
        /**
         * Scale X
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-x": [{
          "scale-x": scaleScale()
        }],
        /**
         * Scale Y
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-y": [{
          "scale-y": scaleScale()
        }],
        /**
         * Scale Z
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-z": [{
          "scale-z": scaleScale()
        }],
        /**
         * Scale 3D
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-3d": ["scale-3d"],
        /**
         * Skew
         * @see https://tailwindcss.com/docs/skew
         */
        skew: [{
          skew: scaleSkew()
        }],
        /**
         * Skew X
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-x": [{
          "skew-x": scaleSkew()
        }],
        /**
         * Skew Y
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-y": [{
          "skew-y": scaleSkew()
        }],
        /**
         * Transform
         * @see https://tailwindcss.com/docs/transform
         */
        transform: [{
          transform: [isArbitraryVariable, isArbitraryValue, "", "none", "gpu", "cpu"]
        }],
        /**
         * Transform Origin
         * @see https://tailwindcss.com/docs/transform-origin
         */
        "transform-origin": [{
          origin: scalePositionWithArbitrary()
        }],
        /**
         * Transform Style
         * @see https://tailwindcss.com/docs/transform-style
         */
        "transform-style": [{
          transform: ["3d", "flat"]
        }],
        /**
         * Translate
         * @see https://tailwindcss.com/docs/translate
         */
        translate: [{
          translate: scaleTranslate()
        }],
        /**
         * Translate X
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-x": [{
          "translate-x": scaleTranslate()
        }],
        /**
         * Translate Y
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-y": [{
          "translate-y": scaleTranslate()
        }],
        /**
         * Translate Z
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-z": [{
          "translate-z": scaleTranslate()
        }],
        /**
         * Translate None
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-none": ["translate-none"],
        // ---------------------
        // --- Interactivity ---
        // ---------------------
        /**
         * Accent Color
         * @see https://tailwindcss.com/docs/accent-color
         */
        accent: [{
          accent: scaleColor()
        }],
        /**
         * Appearance
         * @see https://tailwindcss.com/docs/appearance
         */
        appearance: [{
          appearance: ["none", "auto"]
        }],
        /**
         * Caret Color
         * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
         */
        "caret-color": [{
          caret: scaleColor()
        }],
        /**
         * Color Scheme
         * @see https://tailwindcss.com/docs/color-scheme
         */
        "color-scheme": [{
          scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
        }],
        /**
         * Cursor
         * @see https://tailwindcss.com/docs/cursor
         */
        cursor: [{
          cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Field Sizing
         * @see https://tailwindcss.com/docs/field-sizing
         */
        "field-sizing": [{
          "field-sizing": ["fixed", "content"]
        }],
        /**
         * Pointer Events
         * @see https://tailwindcss.com/docs/pointer-events
         */
        "pointer-events": [{
          "pointer-events": ["auto", "none"]
        }],
        /**
         * Resize
         * @see https://tailwindcss.com/docs/resize
         */
        resize: [{
          resize: ["none", "", "y", "x"]
        }],
        /**
         * Scroll Behavior
         * @see https://tailwindcss.com/docs/scroll-behavior
         */
        "scroll-behavior": [{
          scroll: ["auto", "smooth"]
        }],
        /**
         * Scroll Margin
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-m": [{
          "scroll-m": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin X
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mx": [{
          "scroll-mx": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Y
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-my": [{
          "scroll-my": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Start
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ms": [{
          "scroll-ms": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin End
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-me": [{
          "scroll-me": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Top
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mt": [{
          "scroll-mt": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Right
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mr": [{
          "scroll-mr": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Bottom
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mb": [{
          "scroll-mb": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Left
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ml": [{
          "scroll-ml": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-p": [{
          "scroll-p": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding X
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-px": [{
          "scroll-px": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Y
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-py": [{
          "scroll-py": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Start
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-ps": [{
          "scroll-ps": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding End
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pe": [{
          "scroll-pe": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Top
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pt": [{
          "scroll-pt": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Right
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pr": [{
          "scroll-pr": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Bottom
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pb": [{
          "scroll-pb": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Left
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pl": [{
          "scroll-pl": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Snap Align
         * @see https://tailwindcss.com/docs/scroll-snap-align
         */
        "snap-align": [{
          snap: ["start", "end", "center", "align-none"]
        }],
        /**
         * Scroll Snap Stop
         * @see https://tailwindcss.com/docs/scroll-snap-stop
         */
        "snap-stop": [{
          snap: ["normal", "always"]
        }],
        /**
         * Scroll Snap Type
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-type": [{
          snap: ["none", "x", "y", "both"]
        }],
        /**
         * Scroll Snap Type Strictness
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-strictness": [{
          snap: ["mandatory", "proximity"]
        }],
        /**
         * Touch Action
         * @see https://tailwindcss.com/docs/touch-action
         */
        touch: [{
          touch: ["auto", "none", "manipulation"]
        }],
        /**
         * Touch Action X
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-x": [{
          "touch-pan": ["x", "left", "right"]
        }],
        /**
         * Touch Action Y
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-y": [{
          "touch-pan": ["y", "up", "down"]
        }],
        /**
         * Touch Action Pinch Zoom
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-pz": ["touch-pinch-zoom"],
        /**
         * User Select
         * @see https://tailwindcss.com/docs/user-select
         */
        select: [{
          select: ["none", "text", "all", "auto"]
        }],
        /**
         * Will Change
         * @see https://tailwindcss.com/docs/will-change
         */
        "will-change": [{
          "will-change": ["auto", "scroll", "contents", "transform", isArbitraryVariable, isArbitraryValue]
        }],
        // -----------
        // --- SVG ---
        // -----------
        /**
         * Fill
         * @see https://tailwindcss.com/docs/fill
         */
        fill: [{
          fill: ["none", ...scaleColor()]
        }],
        /**
         * Stroke Width
         * @see https://tailwindcss.com/docs/stroke-width
         */
        "stroke-w": [{
          stroke: [isNumber, isArbitraryVariableLength, isArbitraryLength, isArbitraryNumber]
        }],
        /**
         * Stroke
         * @see https://tailwindcss.com/docs/stroke
         */
        stroke: [{
          stroke: ["none", ...scaleColor()]
        }],
        // ---------------------
        // --- Accessibility ---
        // ---------------------
        /**
         * Forced Color Adjust
         * @see https://tailwindcss.com/docs/forced-color-adjust
         */
        "forced-color-adjust": [{
          "forced-color-adjust": ["auto", "none"]
        }]
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
        "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"]
      },
      conflictingClassGroupModifiers: {
        "font-size": ["leading"]
      },
      orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
    };
  };
  var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);

  // ../../src/utils/cn.ts
  function cn(...inputs) {
    return twMerge(clsx(inputs));
  }

  // content:@/config
  var b = window.BANDA;
  var CONFIG = {
    banda: { nome: b.nome },
    mostrarDicasDeEdicao: false,
    contato: { whatsapp: b.whatsapp, whatsappExibicao: b.whatsappExibicao, email: b.email, localizacao: b.localizacao, mensagemWhatsApp: b.mensagemWhatsApp },
    redes: { instagram: b.instagram, instagramUsuario: "@_banda3em1", youtube: b.youtube },
    imagens: { logo: b.logo, fotoPrincipal: b.fotoCapa, fotosSobre: b.fotosSobre, fundoDestaque: b.fundoDestaque },
    ocultarShowsPassados: b.ocultarShowsPassados,
    agendaGoogle: b.agendaGoogle,
    agenda: b.agenda.map((s) => ({ ...s, linkInfo: s.linkInfo || s.link })),
    galeria: [...b.fotos].sort((a, c) => {
      const rank = (p) => {
        const i = b.galeriaDestaques.indexOf(p);
        return i < 0 ? 999 : i;
      };
      return rank(a.arquivo) - rank(c.arquivo);
    }).map((f) => ({ src: f.arquivo, alt: f.legenda || b.nome, legenda: f.legenda, proporcao: f.proporcao || "4/3" })),
    videos: b.videos.filter((v) => v.youtubeId || v.arquivo || v.arquivoLocal || v.url).map((v) => ({ ...v, tipo: v.tipo || (v.youtubeId ? "youtube" : "arquivo"), url: v.url || v.youtubeId || v.arquivo || v.arquivoLocal })),
    linkMaisVideos: b.linkMaisVideos
  };

  // ../../src/utils/helpers.ts
  function isFilled(value) {
    return !!value && value.trim() !== "" && !/_AQUI/i.test(value);
  }
  function isUrl(value) {
    return isFilled(value) && /^https?:\/\//i.test(value.trim());
  }
  var onlyDigits = (value) => value.replace(/\D/g, "");
  function getWhatsAppNumber() {
    const digits = onlyDigits(CONFIG.contato.whatsapp || "");
    return digits.length >= 10 && digits.length <= 15 ? digits : null;
  }
  function whatsappUrl(message) {
    const number = getWhatsAppNumber();
    if (!number) return null;
    return message ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/${number}`;
  }
  var MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  var DIAS_SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  function parseLocalDate(iso) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso ?? "").trim());
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  function toISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function formatDateBR(iso) {
    const date = parseLocalDate(iso);
    if (!date) return iso;
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${date.getFullYear()} (${DIAS_SEMANA[date.getDay()]})`;
  }
  function mapsUrl(show) {
    if (isUrl(show.linkMapa)) return show.linkMapa;
    const query = [show.local, show.endereco, show.cidade].filter((part) => isFilled(part)).join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  function getYouTubeId(url) {
    const value = (url ?? "").trim();
    if (!value || /_AQUI/i.test(value)) return null;
    if (/^[\w-]{11}$/.test(value)) return value;
    const match = value.match(
      /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/i
    );
    return match ? match[1] : null;
  }
  function formatPhoneBR(value) {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length === 0) return "";
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  // runtime:react/jsx-runtime
  var { jsx, jsxs, Fragment: Fragment2 } = window.BandaRuntime.JSX;

  // ../../src/components/ui/Logo.tsx
  function Logo({ className, imgClassName, esconderSeFaltar = false }) {
    const [falhou, setFalhou] = useState(false);
    const src = CONFIG.imagens.logo;
    if (!isFilled(src) || falhou) {
      if (esconderSeFaltar) return null;
      return /* @__PURE__ */ jsxs("span", { className: cn("font-display leading-none tracking-wider text-white", className), children: [
        "BANDA ",
        /* @__PURE__ */ jsx("span", { className: "texto-neon", children: "3 EM 1" })
      ] });
    }
    return /* @__PURE__ */ jsx("img", { src, alt: `Logo ${CONFIG.banda.nome}`, decoding: "async", className: imgClassName, onError: () => setFalhou(true) });
  }

  // ../../src/components/ui/Icons.tsx
  function WhatsAppIcon(props) {
    return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", ...props, children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" }) });
  }
  function InstagramIcon(props) {
    return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...props, children: [
      /* @__PURE__ */ jsx("rect", { x: "2.5", y: "2.5", width: "19", height: "19", rx: "5.5" }),
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4.2" }),
      /* @__PURE__ */ jsx("circle", { cx: "17.4", cy: "6.6", r: "0.9", fill: "currentColor", stroke: "none" })
    ] });
  }
  function YouTubeIcon(props) {
    return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", ...props, children: /* @__PURE__ */ jsx("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" }) });
  }
  function FacebookIcon(props) {
    return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", ...props, children: /* @__PURE__ */ jsx("path", { d: "M14 8h3V4h-3c-2.76 0-4.5 1.79-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V9c0-.6.4-1 1-1Z" }) });
  }
  function TikTokIcon(props) {
    return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", ...props, children: /* @__PURE__ */ jsx("path", { d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" }) });
  }
  function SpotifyIcon(props) {
    return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", ...props, children: /* @__PURE__ */ jsx("path", { d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0Zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02Zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2Zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3Z" }) });
  }

  // ../../src/components/ui/SocialLinks.tsx
  function getRedesSociais() {
    const { redes, contato } = CONFIG;
    const lista = [
      {
        id: "instagram",
        nome: "Instagram",
        url: isUrl(redes.instagram) ? redes.instagram : null,
        detalhe: redes.instagramUsuario,
        Icone: InstagramIcon,
        principal: true
      },
      { id: "youtube", nome: "YouTube", url: isUrl(redes.youtube) ? redes.youtube : null, Icone: YouTubeIcon, principal: true },
      {
        id: "whatsapp",
        nome: "WhatsApp",
        url: whatsappUrl(contato.mensagemWhatsApp),
        detalhe: isFilled(contato.whatsappExibicao) ? contato.whatsappExibicao : void 0,
        Icone: WhatsAppIcon,
        principal: true
      },
      { id: "facebook", nome: "Facebook", url: isUrl(redes.facebook) ? redes.facebook : null, Icone: FacebookIcon, principal: false },
      { id: "tiktok", nome: "TikTok", url: isUrl(redes.tiktok) ? redes.tiktok : null, Icone: TikTokIcon, principal: false },
      { id: "spotify", nome: "Spotify", url: isUrl(redes.spotify) ? redes.spotify : null, Icone: SpotifyIcon, principal: false }
    ];
    return lista.filter((rede) => rede.url || rede.principal && CONFIG.mostrarDicasDeEdicao);
  }
  function SocialLinks({ className, small = false }) {
    const redes = getRedesSociais();
    if (redes.length === 0) return null;
    return /* @__PURE__ */ jsx("ul", { className: cn("flex flex-wrap items-center gap-2.5", className), children: redes.map(({ id, nome, url, Icone }) => /* @__PURE__ */ jsx("li", { children: url ? /* @__PURE__ */ jsx(
      "a",
      {
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `${nome} da ${CONFIG.banda.nome}`,
        title: nome,
        className: cn("social-btn", small && "social-btn-sm"),
        children: /* @__PURE__ */ jsx(Icone, {})
      }
    ) : /* @__PURE__ */ jsx(
      "span",
      {
        role: "img",
        "aria-label": `${nome}: em breve`,
        title: `${nome}: link ainda não configurado (src/config.ts)`,
        className: cn("social-btn is-disabled", small && "social-btn-sm"),
        children: /* @__PURE__ */ jsx(Icone, {})
      }
    ) }, id)) });
  }

  // ../../src/components/Header.tsx
  var SECOES_DO_MENU = {
    inicio: ["inicio"],
    sobre: ["sobre"],
    repertorio: ["repertorio"],
    agenda: ["agenda"],
    galeria: ["galeria"],
    videos: ["videos"],
    contrate: ["contrate", "faq"]
  };
  var TODAS_AS_SECOES = Object.values(SECOES_DO_MENU).flat();
  function Header() {
    const scrolled = useScrolled(24);
    const [open, setOpen] = useState(false);
    const activeSection = useActiveSection(TODAS_AS_SECOES);
    const activeItem = Object.keys(SECOES_DO_MENU).find((key) => SECOES_DO_MENU[key].includes(activeSection)) ?? "inicio";
    useLockBodyScroll(open);
    useEffect(() => {
      if (!open) return;
      const onKey = (event) => {
        if (event.key === "Escape") setOpen(false);
      };
      const desktop = window.matchMedia("(min-width: 1024px)");
      const onChange = () => {
        if (desktop.matches) setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      desktop.addEventListener("change", onChange);
      return () => {
        window.removeEventListener("keydown", onKey);
        desktop.removeEventListener("change", onChange);
      };
    }, [open]);
    const close = () => setOpen(false);
    const itensMobile = [...MENU, { id: "contrate", label: "Contrate" }];
    return /* @__PURE__ */ jsxs(Fragment2, { children: [
      /* @__PURE__ */ jsxs(
        "header",
        {
          className: cn(
            "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
            scrolled || open ? "bg-ink-950/80 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl" : "bg-transparent"
          ),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "container-site flex h-[72px] items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsx("a", { href: "#inicio", onClick: close, className: "flex shrink-0 items-center rounded-lg", title: "Voltar ao início", children: /* @__PURE__ */ jsx(Logo, { imgClassName: "h-10 w-auto max-w-[150px] object-contain sm:h-11 sm:max-w-[170px]", className: "text-[1.7rem]" }) }),
              /* @__PURE__ */ jsx("nav", { "aria-label": "Menu principal", className: "hidden lg:block", children: /* @__PURE__ */ jsx("ul", { className: "flex items-center gap-0.5 xl:gap-1", children: MENU.map((item) => {
                const ativo = activeItem === item.id;
                return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `#${item.id}`,
                    "aria-current": ativo ? "true" : void 0,
                    className: cn(
                      "relative block rounded-full px-3.5 py-2 text-[0.74rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 xl:px-4",
                      ativo ? "text-white" : "text-white/65 hover:text-white"
                    ),
                    children: [
                      item.label,
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          "aria-hidden": "true",
                          className: cn(
                            "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-linear-to-r from-neon-cyan to-neon-purple shadow-[0_0_10px_rgba(0,166,255,0.8)] transition-transform duration-300 xl:inset-x-4",
                            ativo ? "scale-x-100" : "scale-x-0"
                          )
                        }
                      )
                    ]
                  }
                ) }, item.id);
              }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-4 lg:flex", children: [
                /* @__PURE__ */ jsx(SocialLinks, { small: true, className: "hidden xl:flex" }),
                /* @__PURE__ */ jsx("a", { href: "#contrate", className: "btn btn-primary btn-sm", children: "Contrate" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setOpen((value) => !value),
                  "aria-expanded": open,
                  "aria-controls": "menu-mobile",
                  "aria-label": open ? "Fechar menu" : "Abrir menu",
                  className: "relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:border-neon-cyan/50 lg:hidden",
                  children: /* @__PURE__ */ jsxs("span", { className: "relative block h-3.5 w-5", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: cn(
                          "absolute left-0 h-0.5 w-5 rounded-full bg-white transition-all duration-300",
                          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: cn(
                          "absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-white transition-all duration-300",
                          open && "opacity-0"
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: cn(
                          "absolute left-0 h-0.5 w-5 rounded-full bg-white transition-all duration-300",
                          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-full -translate-y-full"
                        )
                      }
                    )
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": "true",
                className: cn(
                  "absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neon-blue/50 to-transparent transition-opacity duration-500",
                  scrolled ? "opacity-100" : "opacity-0"
                )
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          id: "menu-mobile",
          inert: !open,
          className: cn(
            "fixed inset-0 z-40 overflow-hidden transition-[opacity,visibility] duration-500 lg:hidden",
            open ? "visible opacity-100" : "invisible opacity-0"
          ),
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-ink-950/95 backdrop-blur-xl", onClick: close }),
            /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,166,255,0.25),transparent_65%)]" }),
            /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(164,61,255,0.28),transparent_65%)]" }),
            /* @__PURE__ */ jsxs("nav", { "aria-label": "Menu principal (celular)", className: "relative flex h-full flex-col overflow-y-auto px-6 pb-12 pt-24", children: [
              /* @__PURE__ */ jsx("ul", { className: "flex flex-col", children: itensMobile.map((item, i) => {
                const ativo = activeItem === item.id;
                return /* @__PURE__ */ jsx(
                  "li",
                  {
                    className: cn("transition-all duration-500", open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
                    style: { transitionDelay: open ? `${90 + i * 45}ms` : "0ms" },
                    children: /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: `#${item.id}`,
                        onClick: close,
                        "aria-current": ativo ? "true" : void 0,
                        className: "flex items-center justify-between border-b border-white/5 py-3.5 font-display text-[2.4rem] uppercase leading-none tracking-wide text-white transition-colors hover:text-neon-cyan",
                        children: [
                          /* @__PURE__ */ jsx("span", { className: ativo ? "texto-neon" : void 0, children: item.label }),
                          /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-6 w-6 text-white/40", "aria-hidden": "true" })
                        ]
                      }
                    )
                  },
                  item.id
                );
              }) }),
              /* @__PURE__ */ jsx("a", { href: "#orcamento", onClick: close, className: "btn btn-primary mt-8 w-full", children: "Solicitar orçamento" }),
              /* @__PURE__ */ jsx(SocialLinks, { className: "mt-8 justify-center" })
            ] })
          ]
        }
      )
    ] });
  }

  // ../../src/components/ui/SmartImage.tsx
  function SmartImage({
    src,
    alt,
    label,
    ratio = "4/3",
    priority = false,
    className,
    imgClassName,
    placeholderClassName,
    onLoaded
  }) {
    const [status, setStatus] = useState(isFilled(src) ? "loading" : "error");
    const imgRef = useRef(null);
    useEffect(() => {
      const img = imgRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        setStatus("loaded");
        onLoaded?.();
      }
    }, []);
    if (status === "error") {
      return /* @__PURE__ */ jsx(PhotoPlaceholder, { src, label: label ?? alt, ratio, className: cn(className, placeholderClassName) });
    }
    return /* @__PURE__ */ jsx(
      "img",
      {
        ref: imgRef,
        src,
        alt,
        loading: priority ? "eager" : "lazy",
        decoding: "async",
        fetchPriority: priority ? "high" : "auto",
        onLoad: () => {
          setStatus("loaded");
          onLoaded?.();
        },
        onError: () => setStatus("error"),
        style: { aspectRatio: `auto ${window.BANDA.proporcoesImagens?.[src] || ratio}` },
        className: cn(
          "block h-auto transition-opacity duration-700",
          status === "loaded" ? "opacity-100" : "opacity-0",
          className,
          imgClassName
        )
      }
    );
  }
  function PhotoPlaceholder({ src, label, ratio, className }) {
    const dicas = CONFIG.mostrarDicasDeEdicao;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        role: "img",
        "aria-label": dicas ? `Espaço reservado para a foto: ${label}` : "Foto em breve",
        className: cn(
          "photo-placeholder relative flex w-full flex-col items-center justify-center gap-2.5 overflow-hidden p-4 text-center",
          className
        ),
        style: { aspectRatio: ratio },
        children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neon-cyan/40 bg-ink-900/60 text-neon-cyan shadow-[0_0_24px_-6px_rgba(0,166,255,0.7)]", children: /* @__PURE__ */ jsx(Camera, { className: "h-5 w-5", "aria-hidden": "true" }) }),
          dicas ? /* @__PURE__ */ jsxs(Fragment2, { children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-lg leading-tight tracking-wide text-white/90 sm:text-xl", children: label }),
            /* @__PURE__ */ jsxs("span", { className: "max-w-full break-all font-mono text-[10px] leading-snug text-soft sm:text-[11px]", children: [
              "public/",
              src
            ] })
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.3em] text-soft", children: "Foto em breve" })
        ]
      }
    );
  }

  // ../../src/components/ui/Decor.tsx
  function Equalizer({ className, bars = 4 }) {
    return /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: cn("eq", className), children: Array.from({ length: bars }, (_, i) => /* @__PURE__ */ jsx("span", {}, i)) });
  }
  function CountUp({ value, prefix = "", suffix = "", duration = 1600 }) {
    const [ref, visible] = useReveal();
    const [current, setCurrent] = useState(0);
    useEffect(() => {
      if (!visible) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCurrent(value);
        return;
      }
      let frame = 0;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(eased * value));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [visible, value, duration]);
    return /* @__PURE__ */ jsxs("span", { ref, children: [
      prefix,
      current,
      suffix
    ] });
  }
  var PARTICLE_COLORS = ["61,227,255", "0,166,255", "164,61,255", "123,44,255"];
  function Particles({ className }) {
    const canvasRef = useRef(null);
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let width = 0;
      let height = 0;
      let frame = 0;
      let inView = true;
      let particles = [];
      const spawn = () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.22 + 0.04),
        a: Math.random() * 0.55 + 0.15,
        c: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        t: Math.random() * Math.PI * 2
      });
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
          const alpha = p.a * (0.55 + 0.45 * Math.sin(p.t));
          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.c},${alpha.toFixed(3)})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const total = Math.round(Math.min(70, width * height / 16e3));
        particles = Array.from({ length: total }, spawn);
        draw();
      };
      const step = () => {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.t += 0.015;
          if (p.y < -8) {
            p.y = height + 8;
            p.x = Math.random() * width;
          }
          if (p.x < -8) p.x = width + 8;
          else if (p.x > width + 8) p.x = -8;
        }
        draw();
        frame = requestAnimationFrame(step);
      };
      const start = () => {
        if (!frame && inView && !document.hidden && !reduce) frame = requestAnimationFrame(step);
      };
      const stop = () => {
        cancelAnimationFrame(frame);
        frame = 0;
      };
      resize();
      start();
      const resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(canvas);
      const viewObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      });
      viewObserver.observe(canvas);
      const onVisibility = () => document.hidden ? stop() : start();
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        stop();
        resizeObserver.disconnect();
        viewObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, []);
    return /* @__PURE__ */ jsx("canvas", { ref: canvasRef, "aria-hidden": "true", className });
  }

  // ../../src/components/Hero.tsx
  function Hero() {
    const [fotoCarregada, setFotoCarregada] = useState(false);
    const foto = CONFIG.imagens.fotoPrincipal;
    return /* @__PURE__ */ jsxs("section", { id: "inicio", "aria-labelledby": "hero-titulo", className: "relative isolate flex min-h-svh items-center overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0 -z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0e0e2e_0%,#05050f_62%)]" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -left-[22%] -top-[28%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(0,166,255,0.22),transparent_62%)]" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-[32%] -right-[18%] h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(circle,rgba(164,61,255,0.24),transparent_62%)]" }),
        /* @__PURE__ */ jsx("div", { className: "fundo-grade absolute inset-0 opacity-50" }),
        /* @__PURE__ */ jsx("div", { className: "hero-floor absolute -inset-x-1/2 bottom-0 h-[36%]" }),
        /* @__PURE__ */ jsx(Particles, { className: "absolute inset-0 h-full w-full" }),
        /* @__PURE__ */ jsx("div", { className: "fundo-ruido absolute inset-0" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink-900" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "container-site w-full pb-28 pt-24 sm:pt-28 lg:pb-24", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-10 lg:grid-cols-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "order-2 text-center lg:order-1 lg:col-span-5 lg:text-left", children: [
          /* @__PURE__ */ jsxs(
            "p",
            {
              className: "hero-in inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85",
              style: { animationDelay: "0.1s" },
              children: [
                /* @__PURE__ */ jsx(Equalizer, {}),
                HERO.selo
              ]
            }
          ),
          /* @__PURE__ */ jsxs("h1", { id: "hero-titulo", "aria-label": CONFIG.banda.nome, className: "mt-6 font-display uppercase leading-[0.84] tracking-wide", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "hero-in block text-[clamp(4rem,23vw,7.5rem)] text-white lg:text-[clamp(5.25rem,8.2vw,9.5rem)]",
                style: { animationDelay: "0.2s" },
                children: "Banda"
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "neon-flicker block text-[clamp(5rem,29vw,9.5rem)] lg:text-[clamp(6.75rem,10.5vw,12rem)]",
                style: { animationDelay: "0.35s" },
                children: /* @__PURE__ */ jsx("span", { className: "texto-neon neon-glow", children: "3 em 1" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "hero-in mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0",
              style: { animationDelay: "0.5s" },
              children: HERO.frase
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "hero-in mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start",
              style: { animationDelay: "0.62s" },
              children: [
                /* @__PURE__ */ jsxs("a", { href: "#orcamento", className: "btn btn-primary", children: [
                  "Contrate a banda ",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
                ] }),
                /* @__PURE__ */ jsxs("a", { href: "#agenda", className: "btn btn-outline", children: [
                  /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4", "aria-hidden": "true" }),
                  " Veja nossa agenda"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "#sobre",
              className: "hero-in group mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-white",
              style: { animationDelay: "0.72s" },
              children: [
                "Conheça a banda",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1", "aria-hidden": "true" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "ul",
            {
              "aria-label": "Estilos musicais",
              className: "hero-in mt-8 flex flex-wrap justify-center gap-2 lg:justify-start",
              style: { animationDelay: "0.82s" },
              children: HERO.estilos.map((estilo) => /* @__PURE__ */ jsx("li", { className: "chip", children: estilo }, estilo))
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "order-1 lg:order-2 lg:col-span-7", children: /* @__PURE__ */ jsxs("div", { className: "hero-in relative isolate mx-auto w-full max-w-3xl", style: { animationDelay: "0.15s" }, children: [
          fotoCarregada && /* @__PURE__ */ jsx(
            "img",
            {
              src: foto,
              alt: "",
              "aria-hidden": "true",
              className: "pointer-events-none absolute inset-0 -z-10 h-full w-full scale-105 object-cover opacity-50 blur-3xl"
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "pointer-events-none absolute -inset-10 -z-20 bg-[radial-gradient(closest-side,rgba(0,166,255,0.3),rgba(164,61,255,0.18)_60%,transparent)]"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "frame-neon", children: /* @__PURE__ */ jsxs("div", { className: "frame-inner", children: [
            /* @__PURE__ */ jsx(
              SmartImage,
              {
                src: foto,
                alt: "Integrantes da Banda 3 em 1 agachados — foto oficial da banda",
                label: "Banda 1 — integrantes agachados",
                ratio: "4/3",
                priority: true,
                className: "w-full",
                imgClassName: "max-h-[78svh] object-contain",
                onLoaded: () => setFotoCarregada(true)
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": "true",
                className: "pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,15,0.3),transparent_30%)]"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "glass animate-float absolute -left-2 top-4 flex items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white sm:-left-5 sm:top-8 sm:text-[11px]", children: [
            /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-pink opacity-75" }),
              /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-neon-pink" })
            ] }),
            "Ao vivo"
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "glass animate-float absolute -bottom-6 -right-2 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:-right-5 sm:flex",
              style: { animationDelay: "-3s" },
              children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-neon-blue to-neon-purple shadow-[0_0_20px_-4px_rgba(0,166,255,0.8)]", children: /* @__PURE__ */ jsx(Music, { className: "h-5 w-5 text-white", "aria-hidden": "true" }) }),
                /* @__PURE__ */ jsxs("span", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-semibold uppercase tracking-[0.25em] text-soft", children: "Uma viagem musical" }),
                  /* @__PURE__ */ jsx("span", { className: "block font-display text-xl uppercase leading-none tracking-wide text-white", children: "Através do tempo" })
                ] })
              ]
            }
          )
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "#sobre",
          "aria-label": "Rolar para a próxima seção",
          className: "absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50 transition-colors hover:text-white",
          children: [
            /* @__PURE__ */ jsx("span", { className: "scroll-mouse", "aria-hidden": "true" }),
            "Role"
          ]
        }
      )
    ] });
  }

  // ../../src/components/Marquee.tsx
  function Marquee() {
    const renderRow = (duplicada) => /* @__PURE__ */ jsx("ul", { className: "flex shrink-0 items-center", "aria-hidden": duplicada || void 0, children: FAIXA_ESTILOS.map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `px-6 font-display text-4xl uppercase tracking-wide sm:px-8 sm:text-5xl lg:text-6xl ${i % 2 === 0 ? "texto-neon" : "texto-contorno"}`,
          children: item
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-xl text-neon-cyan/70 sm:text-2xl", "aria-hidden": "true", children: "✦" })
    ] }, `${item}-${i}`)) });
    return /* @__PURE__ */ jsxs("section", { "aria-label": "Estilos musicais da banda", className: "marquee relative overflow-hidden border-y border-white/5 bg-ink-850 py-6 sm:py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "marquee-track flex w-max", children: [
        renderRow(false),
        renderRow(true)
      ] }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-ink-850 to-transparent sm:w-32" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-ink-850 to-transparent sm:w-32" })
    ] });
  }

  // ../../src/components/ui/Reveal.tsx
  function Reveal({ as, children, className, variant = "up", delay = 0, style, ...rest }) {
    const Tag = as ?? "div";
    const [ref, visible] = useReveal();
    return /* @__PURE__ */ jsx(
      Tag,
      {
        ref,
        "data-reveal": variant,
        className: cn("reveal", visible && "is-visible", className),
        style: { ...style, "--reveal-delay": `${delay}ms` },
        ...rest,
        children
      }
    );
  }

  // ../../src/components/ui/SectionHeading.tsx
  function SectionHeading({ id, eyebrow, title, highlight, subtitle, align = "center", className }) {
    const center = align === "center";
    return /* @__PURE__ */ jsxs(Reveal, { className: cn("max-w-3xl", center && "mx-auto text-center", className), children: [
      eyebrow && /* @__PURE__ */ jsx("p", { className: cn("eyebrow", center && "is-center"), children: eyebrow }),
      /* @__PURE__ */ jsxs("h2", { id, className: "mt-4 font-display text-[clamp(2.9rem,9vw,4.75rem)] uppercase leading-[0.92] tracking-wide text-white", children: [
        title,
        title && highlight ? " " : null,
        highlight && /* @__PURE__ */ jsx("span", { className: "texto-neon", children: highlight })
      ] }),
      subtitle && /* @__PURE__ */ jsx("p", { className: cn("mt-5 text-base leading-relaxed text-muted sm:text-lg", center && "mx-auto max-w-2xl"), children: subtitle })
    ] });
  }

  // ../../src/components/About.tsx
  function About() {
    const [fotoMaior, fotoMenor] = CONFIG.imagens.fotosSobre;
    return /* @__PURE__ */ jsxs("section", { id: "sobre", "aria-labelledby": "sobre-titulo", className: "section overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -left-48 top-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(0,166,255,0.13),transparent_65%)]" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -right-48 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(164,61,255,0.13),transparent_65%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "container-site relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-16 lg:grid-cols-2 lg:gap-20", children: [
          /* @__PURE__ */ jsxs(Reveal, { variant: "left", className: "relative mx-auto w-full max-w-xl pb-16 sm:pb-20", children: [
            /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute -left-5 -top-5 h-28 w-28 rounded-full border border-neon-cyan/25" }),
            /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute -right-4 top-1/4 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(164,61,255,0.35),transparent_70%)]" }),
            fotoMaior && /* @__PURE__ */ jsx("div", { className: "frame-neon relative w-[86%]", children: /* @__PURE__ */ jsx("div", { className: "frame-inner", children: /* @__PURE__ */ jsx(SmartImage, { src: fotoMaior, alt: "Foto oficial da Banda 3 em 1", label: "Banda 2 — foto da banda", ratio: "4/5", className: "w-full" }) }) }),
            fotoMenor && /* @__PURE__ */ jsx("div", { className: "frame-neon absolute bottom-0 right-0 w-[50%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]", children: /* @__PURE__ */ jsx("div", { className: "frame-inner", children: /* @__PURE__ */ jsx(SmartImage, { src: fotoMenor, alt: "Foto oficial da Banda 3 em 1", label: "Banda 3 — foto da banda", ratio: "1/1", className: "w-full" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "glass animate-float absolute bottom-5 left-2 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-4 sm:bottom-10", children: [
              /* @__PURE__ */ jsx(Equalizer, { bars: 5 }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 sm:text-[11px]", children: "Uma viagem musical" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(SectionHeading, { id: "sobre-titulo", align: "left", eyebrow: SOBRE.selo, title: SOBRE.titulo, highlight: SOBRE.destaque }),
            /* @__PURE__ */ jsx(Reveal, { delay: 100, className: "mt-7 space-y-4 text-[1.02rem] leading-relaxed text-muted", children: SOBRE.paragrafos.map((paragrafo) => /* @__PURE__ */ jsx("p", { children: paragrafo }, paragrafo)) }),
            /* @__PURE__ */ jsx(Reveal, { delay: 180, children: /* @__PURE__ */ jsx("blockquote", { className: "mt-8 border-l-2 border-neon-cyan/70 pl-5 font-display text-3xl uppercase leading-tight tracking-wide text-white sm:text-4xl", children: SOBRE.frase }) }),
            /* @__PURE__ */ jsx(Reveal, { delay: 240, children: /* @__PURE__ */ jsx("dl", { className: "mt-10 grid grid-cols-3 gap-3 border-y border-white/5 py-6 sm:gap-4", children: SOBRE.numeros.map((numero) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse text-center sm:text-left", children: [
              /* @__PURE__ */ jsx("dt", { className: "mt-1 text-[10px] uppercase leading-snug tracking-[0.14em] text-soft sm:text-[11px]", children: numero.rotulo }),
              /* @__PURE__ */ jsx("dd", { className: "font-display text-4xl leading-none sm:text-5xl", children: /* @__PURE__ */ jsx("span", { className: "texto-neon", children: /* @__PURE__ */ jsx(CountUp, { value: numero.valor, prefix: numero.prefixo, suffix: numero.sufixo }) }) })
            ] }, numero.rotulo)) }) }),
            /* @__PURE__ */ jsxs(Reveal, { delay: 300, className: "mt-9 flex flex-col gap-3 sm:flex-row", children: [
              /* @__PURE__ */ jsx("a", { href: "#orcamento", className: "btn btn-primary", children: "Contrate a banda" }),
              /* @__PURE__ */ jsx("a", { href: "#repertorio", className: "btn btn-outline", children: "Ver repertório" })
            ] })
          ] })
        ] }),
        jsx(Members, {}),
        /* @__PURE__ */ jsxs(Reveal, { className: "mt-16 text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-soft", children: "Onde a gente toca" }),
          /* @__PURE__ */ jsx("ul", { className: "mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-2.5", children: SOBRE.ondeTocamos.map((lugar) => /* @__PURE__ */ jsx("li", { className: "chip", children: lugar }, lugar)) })
        ] })
      ] })
    ] });
  }

  // ../../src/components/MusicStyles.tsx
  function Members() {
    return jsxs("div", {className:"members", children:[
      jsx("h3", {className:"font-display text-4xl uppercase text-center", children:"Quem faz esse som"}),
      ...window.BANDA.integrantes.map((p,i) => jsx(Reveal, {className:"member-row card-neon", variant:i%2?"right":"left", children:jsxs("article", {children:[
        jsx("div", {className:"member-photo", children:jsx(SmartImage,{src:p.arquivo,alt:p.nome+" — "+p.funcao,className:"w-full",imgClassName:"object-contain"})}),
        jsxs("div",{className:"member-copy",children:[jsx("p",{className:"eyebrow",children:p.funcao}),jsx("h4",{className:"font-display text-4xl uppercase texto-neon",children:p.nome}),jsx("p",{className:"text-muted leading-relaxed",children:p.descricao})]})
      ]})},p.nome))
    ]});
  }
  function MusicStyles() {
    return jsxs("div", {id:"estilos",className:"style-links",children:[
      jsx("h3",{className:"eyebrow",children:"Nosso som · escolha um estilo e assista"}),
      jsx("div",{className:"style-links-grid",children:window.BANDA.estilosVideos.map((item,i)=>jsxs("a",{href:item.destino,className:"card-neon card-hover style-link",children:[
        jsx([CassetteTape,Guitar,Music][i]||Music,{className:"h-7 w-7 text-neon-cyan","aria-hidden":true}),
        jsx("span",{className:"font-display text-4xl uppercase",children:item.nome}),
        jsx("span",{className:"text-sm text-muted",children:"Assistir vídeos"}),
        jsx(Play,{className:"h-4 w-4","aria-hidden":true})
      ]},item.nome))})
    ]});
  }

  // ../../src/components/Experience.tsx
  function Experience() {
    const { linhaDoTempo } = EXPERIENCIA;
    return /* @__PURE__ */ jsxs("div", { id: "experiencia", "aria-labelledby": "experiencia-titulo", className: "experience-inline relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0", children: [
        /* @__PURE__ */ jsx("div", { className: "beam", style: { "--x": "12%", "--r": "-8deg", "--beam-color": "rgba(0,166,255,0.13)" } }),
        /* @__PURE__ */ jsx("div", { className: "beam", style: { "--x": "88%", "--r": "8deg", "--beam-color": "rgba(164,61,255,0.14)" } }),
        /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-1/2 h-[30rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(90,92,255,0.12),transparent_65%)]" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "container-site relative", children: [
        jsx("h3",{id:"experiencia-titulo",className:"font-display text-3xl uppercase text-center",children:"Uma viagem musical através do tempo"}),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto mt-16 max-w-6xl lg:mt-20", children: [
          /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute left-[10%] right-[10%] top-6 hidden h-px bg-linear-to-r from-neon-cyan/70 via-neon-indigo/60 to-neon-purple/70 lg:block", children: /* @__PURE__ */ jsx("div", { className: "timeline-runner", children: /* @__PURE__ */ jsx("span", { className: "timeline-dot" }) }) }),
          /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute bottom-6 left-6 top-6 w-px bg-linear-to-b from-neon-cyan/70 via-neon-indigo/60 to-neon-purple/70 lg:hidden" }),
          /* @__PURE__ */ jsx("ol", { className: "relative grid gap-10 lg:grid-cols-5 lg:gap-6", children: linhaDoTempo.map((item, i) => /* @__PURE__ */ jsxs(Reveal, { as: "li", delay: i * 120, className: "relative min-h-12 pl-20 lg:pl-0 lg:text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "timeline-node absolute left-0 top-0 lg:relative lg:mx-auto", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { className: "timeline-node-core" }) }),
            /* @__PURE__ */ jsx("p", { className: "font-display text-4xl uppercase tracking-wide lg:mt-7 lg:text-5xl", children: /* @__PURE__ */ jsx("span", { className: "texto-neon", children: item.decada }) }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-xs text-sm leading-relaxed text-muted lg:mx-auto", children: item.texto })
          ] }, item.decada)) })
        ] }),
        jsx(MusicStyles, {})
      ] })
    ] });
  }

  // ../../src/components/ui/WhatsAppButton.tsx
  function WhatsAppButton({ mensagem, className, children }) {
    const url = whatsappUrl(mensagem ?? CONFIG.contato.mensagemWhatsApp);
    if (!url) {
      return /* @__PURE__ */ jsx("a", { href: "#orcamento", className, title: "Número do WhatsApp ainda não configurado (src/config.ts)", children });
    }
    return /* @__PURE__ */ jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", className, children });
  }

  // ../../src/components/Repertoire.tsx
  var FILTROS = [{ id: "todos", label: "Todos" }, ...CATEGORIAS];
  var nomeDaCategoria = (id) => CATEGORIAS.find((c) => c.id === id)?.label ?? id;
  var totalPorFiltro = (id) => id === "todos" ? REPERTORIO.length : REPERTORIO.filter((m) => m.categoria === id).length;
  function Repertoire() {
    const [filtro, setFiltro] = useState("todos");
    const [expandido, setExpandido] = useState(false);
    const lista = useMemo(() => filtro === "todos" ? REPERTORIO : REPERTORIO.filter((m) => m.categoria === filtro), [filtro]);
    const visiveis = expandido ? lista : lista.slice(0, 6);
    return /* @__PURE__ */ jsxs("section", { id: "repertorio", "aria-labelledby": "repertorio-titulo", className: "section overflow-hidden bg-ink-850/70", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neon-purple/40 to-transparent" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(164,61,255,0.14),transparent_65%)]" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,166,255,0.12),transparent_65%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "container-site relative", children: [
        /* @__PURE__ */ jsx(
          SectionHeading,
          {
            id: "repertorio-titulo",
            eyebrow: REPERTORIO_TEXTOS.selo,
            title: REPERTORIO_TEXTOS.titulo,
            highlight: REPERTORIO_TEXTOS.destaque,
            subtitle: REPERTORIO_TEXTOS.subtitulo
          }
        ),
        jsx(Experience, {}),
        /* @__PURE__ */ jsx(Reveal, { delay: 100, className: "mt-12 flex flex-wrap justify-center gap-2", role: "group", "aria-label": "Filtrar repertório por estilo", children: FILTROS.map((item) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => { setFiltro(item.id); setExpandido(false); },
            "aria-pressed": filtro === item.id,
            className: cn("filter-btn", filtro === item.id && "is-active"),
            children: [
              item.label,
              /* @__PURE__ */ jsx("span", { className: "count", children: totalPorFiltro(item.id) })
            ]
          },
          item.id
        )) }),
        /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-soft", "aria-live": "polite", children: [
          "Mostrando ",
          visiveis.length,
          " de " + lista.length + " músicas"
        ] }),
        /* @__PURE__ */ jsx("ul", { id:"lista-repertorio", className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: visiveis.map((musica, i) => /* @__PURE__ */ jsx("li", { className: "pop-in", style: { animationDelay: `${Math.min(i, 12) * 40}ms` }, children: /* @__PURE__ */ jsxs("div", { className: "card-neon card-hover group flex h-full items-start gap-4 p-4 sm:p-5", children: [
          /* @__PURE__ */ jsx("span", { className: "track-number pt-0.5", "aria-hidden": "true", children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold leading-snug text-white", children: musica.titulo }),
            /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-muted", children: musica.artista }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2.5 flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: cn("cat-badge", `cat-${musica.categoria}`), children: nomeDaCategoria(musica.categoria) }),
              musica.decada && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium uppercase tracking-[0.16em] text-soft", children: musica.decada })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Equalizer, { className: "mt-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100" })
        ] }) }, `${filtro}-${musica.titulo}`)) }),
        lista.length > 6 && jsx("div",{className:"more-control",children:jsx("button",{type:"button",className:"btn btn-outline","aria-expanded":expandido,"aria-controls":"lista-repertorio",onClick:()=>setExpandido(!expandido),children:expandido?"Ver menos músicas":"Ver mais músicas"})}),
        /* @__PURE__ */ jsxs(Reveal, { className: "mt-12 flex flex-col items-center gap-5 text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "max-w-2xl text-sm leading-relaxed text-muted", children: REPERTORIO_TEXTOS.nota }),
          /* @__PURE__ */ jsxs(WhatsAppButton, { mensagem: `Olá! Gostaria de receber o repertório completo da ${CONFIG.banda.nome}.`, className: "btn btn-outline", children: [
            /* @__PURE__ */ jsx(Music, { className: "h-4 w-4", "aria-hidden": "true" }),
            " Pedir repertório completo"
          ] })
        ] })
      ] })
    ] });
  }

  // ../../src/components/Agenda.tsx
  function Agenda() {
    const [expandida, setExpandida] = useState(false);
    const [eventos, setEventos] = useState(CONFIG.agenda);
    const [falha, setFalha] = useState(false);
    useEffect(() => {
      let ativo = true;
      let controller;
      async function atualizar() {
        controller?.abort();
        const request = new AbortController();
        controller = request;
        const timeout = setTimeout(() => request.abort(), 15000);
        try {
          const response = await fetch('assets/agenda.json', {cache:'no-store', signal:request.signal});
          if (!response.ok) throw Error('Agenda indisponível');
          const dados = await response.json();
          if (!Array.isArray(dados.eventos) || !dados.eventos.every(s => typeof s.evento === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.data))) throw Error('Agenda inválida');
          if (ativo) {
            setEventos(dados.eventos);
            const updated = Date.parse(dados.atualizadoEm);
            setFalha(!Number.isFinite(updated) || Date.now()-updated>24*60*60*1000);
          }
        } catch (error) { if (ativo && controller === request) setFalha(true); }
        finally { clearTimeout(timeout); }
      }
      const aoVoltar = () => {if (!document.hidden) atualizar();};
      atualizar();
      const timer = setInterval(aoVoltar, 60000);
      document.addEventListener('visibilitychange', aoVoltar);
      return () => {ativo=false; controller?.abort(); clearInterval(timer); document.removeEventListener('visibilitychange',aoVoltar);};
    }, []);
    const shows = useMemo(() => {
      const hoje = new Date(); hoje.setHours(0,0,0,0);
      return eventos.map(show => ({...show, date:parseLocalDate(show.data)}))
        .filter(show => show.date && (!CONFIG.ocultarShowsPassados || (parseLocalDate(show.dataFim) || show.date) >= hoje))
        .sort((a,b) => a.date-b.date);
    }, [eventos]);
    return jsxs("section",{id:"agenda","aria-labelledby":"agenda-titulo",className:"section overflow-hidden",children:[
      jsxs("div",{className:"container-site relative",children:[
        jsx(SectionHeading,{id:"agenda-titulo",eyebrow:AGENDA_TEXTOS.selo,title:AGENDA_TEXTOS.titulo,highlight:AGENDA_TEXTOS.destaque,subtitle:AGENDA_TEXTOS.subtitulo}),
        jsxs("div",{className:"mx-auto mt-14 max-w-5xl",children:[
          falha && jsx("p",{className:"agenda-status",role:"status",children:"Exibindo a última agenda disponível. Confirme as datas com a banda."}),
          shows.length ? jsx("ul",{id:"lista-agenda",className:"space-y-4",children:(expandida?shows:shows.slice(0,3)).map((show,i)=>jsx(ShowCard,{show,index:i},show.id||show.data+show.evento+i))}) : jsx(AgendaVazia,{}),
          shows.length>3 && jsx("div",{className:"more-control",children:jsx("button",{type:"button",className:"btn btn-outline btn-sm","aria-expanded":expandida,"aria-controls":"lista-agenda",onClick:()=>setExpandida(!expandida),children:expandida?"Ver menos datas":"Ver mais datas"})}),
          jsxs(Reveal,{className:"mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center sm:flex-row sm:text-left",children:[
            jsx("p",{className:"font-display text-2xl uppercase tracking-wide text-white",children:AGENDA_TEXTOS.chamada}),
            jsx("a",{href:"#orcamento",className:"btn btn-primary btn-sm",children:"Consultar disponibilidade"})
          ]})
        ]})
      ]})
    ]});
  }
  function ShowCard({ show, index }) {
    const { date } = show;
    const proximo = index === 0;
    const temLocal = isUrl(show.linkMapa) || isFilled(show.endereco);
    return /* @__PURE__ */ jsx(Reveal, { as: "li", delay: Math.min(index, 6) * 80, children: /* @__PURE__ */ jsxs("article", { className: "show-card card-neon card-hover flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:gap-7", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 md:block", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl bg-linear-to-br from-neon-blue/20 to-neon-purple/20 shadow-[inset_0_0_0_1px_rgba(61,227,255,0.35),0_0_30px_-10px_rgba(0,166,255,0.6)]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.3em] text-neon-cyan", children: MESES_CURTOS[date.getMonth()] }),
          /* @__PURE__ */ jsx("span", { className: "font-display text-5xl leading-none text-white", children: String(date.getDate()).padStart(2, "0") }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-soft", children: date.getFullYear() })
        ] }),
        proximo && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-neon-pink/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-pink md:hidden", children: "Próximo show" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1", children: [
          proximo && /* @__PURE__ */ jsx("span", { className: "hidden rounded-full bg-neon-pink/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-pink md:inline-block", children: "Próximo show" }),
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted", children: [
            DIAS_SEMANA[date.getDay()],
            show.horario && /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "•" }),
              /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5", "aria-hidden": "true" }),
              " ",
              show.horario
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-2 font-display text-3xl uppercase leading-none tracking-wide text-white sm:text-4xl", children: show.evento }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 flex items-start gap-2 text-sm text-muted", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0 text-neon-cyan", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-white/90", children: [show.local,show.cidade].filter(Boolean).join(" — ") || "Local a confirmar" }),
            !show.horario && " · Horário a confirmar"
          ] })
        ] }),
        show.observacao && /* @__PURE__ */ jsx("p", { className: "chip mt-3", children: show.observacao })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row", children: [
        temLocal && /* @__PURE__ */ jsxs("a", { href: mapsUrl(show), target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline btn-sm", children: [
          /* @__PURE__ */ jsx(Navigation, { className: "h-4 w-4", "aria-hidden": "true" }),
          " Como chegar"
        ] }),
        isUrl(show.linkInfo) && /* @__PURE__ */ jsxs("a", { href: show.linkInfo, target: "_blank", rel: "noopener noreferrer", className: "btn btn-primary btn-sm", children: [
          /* @__PURE__ */ jsx(Info, { className: "h-4 w-4", "aria-hidden": "true" }),
          " ",
          show.textoInfo || "Mais informações"
        ] })
      ] }),
      jsx(ShowMap, {show})
    ] }) });
  }
  // O link de incorporação vem de Google Maps > Compartilhar > Incorporar mapa.
  // Só mostra um mapa quando a localização exata já foi configurada.
  function ShowMap({show}) {
    const [aberto, setAberto] = useState(false);
    const raw = show.mapaEmbed;
    let src = null;
    try { const url = new URL(raw); if (url.protocol === "https:" && /^(www\.)?google\.com$/.test(url.hostname) && (url.pathname.startsWith("/maps/embed") || (url.pathname === "/maps" && url.searchParams.get("output") === "embed"))) src = url.href; } catch {}
    if (!src) return null;
    return jsxs("div",{className:"show-map",children:[
      jsx("button",{type:"button",className:"btn btn-outline btn-sm","aria-expanded":aberto,onClick:()=>setAberto(!aberto),children:aberto?"Ocultar mapa":"Ver localização no mapa"}),
      aberto && jsx("iframe",{src,title:"Localização: "+show.evento,loading:"lazy",referrerPolicy:"no-referrer-when-downgrade",allowFullScreen:true})
    ]});
  }

  function AgendaVazia() {
    return jsx(Reveal,{children:jsxs("div",{className:"card-neon agenda-empty",children:[
      jsx(CalendarClock,{className:"h-7 w-7 text-neon-cyan","aria-hidden":true}),
      jsxs("div",{children:[jsx("h3",{className:"font-display text-3xl uppercase",children:AGENDA_TEXTOS.vazioTitulo}),jsx("p",{className:"text-muted",children:AGENDA_TEXTOS.vazioTexto})]}),
      isUrl(CONFIG.redes.instagram) && jsx("a",{href:CONFIG.redes.instagram,target:"_blank",rel:"noopener noreferrer",className:"btn btn-outline btn-sm",children:"Acompanhar no Instagram"})
    ]})});
  }

  // runtime:react-dom
  var { createPortal } = window.BandaRuntime;

  // ../../src/components/Lightbox.tsx
  function Lightbox({ fotos, index, onClose, onChange }) {
    const aberto = index !== null;
    const total = fotos.length;
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const toqueInicial = useRef(null);
    useLockBodyScroll(aberto);
    const anterior = useCallback(() => {
      if (index !== null && total > 0) onChange((index - 1 + total) % total);
    }, [index, total, onChange]);
    const proxima = useCallback(() => {
      if (index !== null && total > 0) onChange((index + 1) % total);
    }, [index, total, onChange]);
    useEffect(() => {
      if (!aberto) return;
      const focoAnterior = document.activeElement;
      closeRef.current?.focus();
      return () => focoAnterior?.focus?.();
    }, [aberto]);
    useEffect(() => {
      if (!aberto) return;
      const onKey = (event) => {
        if (event.key === "Escape") onClose();
        else if (event.key === "ArrowLeft") anterior();
        else if (event.key === "ArrowRight") proxima();
        else if (event.key === "Tab" && dialogRef.current) {
          const botoes = Array.from(dialogRef.current.querySelectorAll("button"));
          if (botoes.length === 0) return;
          const primeiro = botoes[0];
          const ultimo = botoes[botoes.length - 1];
          if (event.shiftKey && document.activeElement === primeiro) {
            event.preventDefault();
            ultimo.focus();
          } else if (!event.shiftKey && document.activeElement === ultimo) {
            event.preventDefault();
            primeiro.focus();
          }
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [aberto, onClose, anterior, proxima]);
    useEffect(() => {
      if (index === null || total < 2) return;
      [index - 1, index + 1].forEach((i) => {
        const foto2 = fotos[(i + total) % total];
        if (foto2) new Image().src = foto2.src;
      });
    }, [index, fotos, total]);
    if (index === null || !fotos[index]) return null;
    const foto = fotos[index];
    return createPortal(
      /* @__PURE__ */ jsxs(
        "div",
        {
          ref: dialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `Foto ${index + 1} de ${total}`,
          className: "fade-in fixed inset-0 z-[100] flex flex-col bg-ink-950/95 backdrop-blur-md",
          onClick: onClose,
          onTouchStart: (event) => {
            toqueInicial.current = event.touches[0]?.clientX ?? null;
          },
          onTouchEnd: (event) => {
            const inicio = toqueInicial.current;
            toqueInicial.current = null;
            if (inicio === null) return;
            const distancia = (event.changedTouches[0]?.clientX ?? inicio) - inicio;
            if (Math.abs(distancia) > 50) {
              if (distancia > 0) anterior();
              else proxima();
            }
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-4 sm:px-6", onClick: (event) => event.stopPropagation(), children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-muted", children: [
                /* @__PURE__ */ jsx("span", { className: "text-white", children: String(index + 1).padStart(2, "0") }),
                " / ",
                String(total).padStart(2, "0")
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  ref: closeRef,
                  type: "button",
                  onClick: onClose,
                  "aria-label": "Fechar visualizador",
                  className: "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-neon-cyan/60 hover:bg-white/10",
                  children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5", "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20", children: [
              /* @__PURE__ */ jsxs("figure", { className: "lb-img-in flex max-h-full max-w-full flex-col items-center", onClick: (event) => event.stopPropagation(), children: [
                /* @__PURE__ */ jsx(
                  SmartImage,
                  {
                    src: foto.src,
                    alt: foto.alt,
                    label: foto.legenda || `Foto ${index + 1}`,
                    ratio: foto.proporcao ?? "4/5",
                    priority: true,
                    className: "max-h-[calc(100svh-9.5rem)] w-auto max-w-full rounded-xl object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]",
                    placeholderClassName: "w-[min(88vw,36rem)] rounded-2xl"
                  },
                  foto.src
                ),
                foto.legenda && /* @__PURE__ */ jsx("figcaption", { className: "mt-4 text-center text-sm text-muted", children: foto.legenda })
              ] }, index),
              total > 1 && /* @__PURE__ */ jsxs(Fragment2, { children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: (event) => {
                      event.stopPropagation();
                      anterior();
                    },
                    "aria-label": "Foto anterior",
                    className: "absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-900/70 text-white backdrop-blur transition hover:border-neon-cyan/60 hover:shadow-[0_0_24px_-4px_rgba(0,166,255,0.7)] sm:left-5",
                    children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6", "aria-hidden": "true" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: (event) => {
                      event.stopPropagation();
                      proxima();
                    },
                    "aria-label": "Próxima foto",
                    className: "absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-900/70 text-white backdrop-blur transition hover:border-neon-cyan/60 hover:shadow-[0_0_24px_-4px_rgba(0,166,255,0.7)] sm:right-5",
                    children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6", "aria-hidden": "true" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "pb-5 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-soft sm:hidden", children: "Deslize para navegar" })
          ]
        }
      ),
      document.body
    );
  }

  // ../../src/components/Gallery.tsx
  function galleryRows(fotos, width) {
    const ratios = fotos.map(foto => {
      const [w, h] = (foto.proporcao || "4/3").split("/").map(Number);
      return w > 0 && h > 0 ? w / h : 4 / 3;
    });
    const target = width < 600 ? 190 : 290;
    const costs = Array(fotos.length + 1).fill(Infinity);
    const ends = [];
    costs[fotos.length] = 0;
    // Choose all row breaks together so the final photo cannot become a tall orphan.
    for (let start = fotos.length - 1; start >= 0; start--) {
      let sum = 0;
      for (let end = start; end < Math.min(start + 6, fotos.length); end++) {
        sum += ratios[end];
        const height = (width - 12 * (end - start)) / sum;
        if (height <= 0) continue;
        const cost = (height - target) ** 2 + costs[end + 1];
        if (cost < costs[start]) { costs[start] = cost; ends[start] = end + 1; }
      }
    }
    const rows = [];
    for (let start = 0; start < fotos.length;) {
      const end = ends[start];
      rows.push(fotos.slice(start, end).map((foto, offset) => ({ foto, index:start + offset, ratio:ratios[start + offset] })));
      start = end;
    }
    return rows;
  }
  function Gallery() {
    const fotos = CONFIG.galeria;
    const [expandida, setExpandida] = useState(false);
    const visiveis = expandida ? fotos : fotos.slice(0,4);
    const galleryRef = useRef(null);
    const [galleryWidth, setGalleryWidth] = useState(1100);
    useEffect(() => {
      const element = galleryRef.current;
      if (!element) return;
      const observer = new ResizeObserver(([entry]) => setGalleryWidth(Math.max(1, entry.contentRect.width)));
      observer.observe(element);
      return () => observer.disconnect();
    }, []);
    const [aberta, setAberta] = useState(null);
    const fechar = useCallback(() => setAberta(null), []);
    return /* @__PURE__ */ jsxs("section", { id: "galeria", "aria-labelledby": "galeria-titulo", className: "section overflow-hidden bg-ink-850/70", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neon-blue/40 to-transparent" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute left-1/2 top-0 h-72 w-[56rem] max-w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(164,61,255,0.16),transparent_70%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "container-site relative", children: [
        /* @__PURE__ */ jsx(
          SectionHeading,
          {
            id: "galeria-titulo",
            eyebrow: GALERIA_TEXTOS.selo,
            title: GALERIA_TEXTOS.titulo,
            highlight: GALERIA_TEXTOS.destaque,
            subtitle: GALERIA_TEXTOS.subtitulo
          }
        ),
        fotos.length > 0 ? /* @__PURE__ */ jsx("div", { ref:galleryRef, id:"lista-galeria", className: "gallery-preview mt-14", children: galleryRows(visiveis, galleryWidth).map((row) => jsx("div", { className:"gallery-row", children:row.map(({foto, index:i, ratio}) => /* @__PURE__ */ jsx(Reveal, { delay: i % 4 * 90, style:{flex:`${ratio} 1 0`, aspectRatio:String(ratio)}, children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setAberta(i),
            "aria-label": `Ampliar foto: ${foto.legenda || foto.alt}`,
            className: "group relative block w-full overflow-hidden rounded-2xl bg-ink-900 text-left shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]",
            children: [
              /* @__PURE__ */ jsx(
                SmartImage,
                {
                  src: foto.src,
                  alt: foto.alt,
                  label: foto.legenda || `Foto ${i + 1}`,
                  ratio: foto.proporcao ?? "4/5",
                  className: "w-full",
                  imgClassName: "transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  className: "pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/85 via-ink-950/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-50"
                }
              ),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  "aria-hidden": "true",
                  className: "pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between gap-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "truncate text-sm font-medium text-white", children: foto.legenda }),
                    /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-ink-950/50 text-white backdrop-blur", children: /* @__PURE__ */ jsx(ZoomIn, { className: "h-4 w-4" }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  className: "pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition duration-500 group-hover:shadow-[inset_0_0_30px_rgba(0,166,255,0.25)] group-hover:ring-neon-cyan/60"
                }
              )
            ]
          }
        ) }, `${foto.src}-${i}`)) }, row[0].foto.src)) }) : /* @__PURE__ */ jsx("p", { className: "mt-14 text-center text-muted", children: "Fotos em breve." }),
        fotos.length > 4 && jsx("div",{className:"more-control",children:jsx("button",{type:"button",className:"btn btn-outline","aria-expanded":expandida,"aria-controls":"lista-galeria",onClick:()=>setExpandida(!expandida),children:expandida?"Ver menos fotos":"Ver mais fotos"})}),
        isUrl(CONFIG.redes.instagram) && /* @__PURE__ */ jsx(Reveal, { className: "mt-10 text-center", children: /* @__PURE__ */ jsxs("a", { href: CONFIG.redes.instagram, target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline", children: [
          /* @__PURE__ */ jsx(InstagramIcon, { className: "h-4 w-4" }),
          " Mais fotos no Instagram"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Lightbox, { fotos, index: aberta, onClose: fechar, onChange: setAberta })
    ] });
  }

  // ../../src/components/Videos.tsx
  var PLATAFORMA = {
    youtube: "YouTube",
    instagram: "Instagram",
    arquivo: "Vídeo",
    link: "Link externo"
  };
  function videoValido(video) {
    if (video.tipo === "youtube") return getYouTubeId(video.url) !== null;
    if (video.tipo === "arquivo") return isFilled(video.url);
    return isUrl(video.url);
  }
  function Videos() {
    const { redes, linkMaisVideos, videos } = CONFIG;
    const [expandidos,setExpandidos] = useState(false);
    const visiveis = expandidos ? videos : videos.slice(0,3);
    const maisVideos = isUrl(linkMaisVideos) ? linkMaisVideos : isUrl(redes.youtube) ? redes.youtube : isUrl(redes.instagram) ? redes.instagram : null;
    const destinoYouTube = maisVideos !== null && /youtu/i.test(maisVideos);
    return /* @__PURE__ */ jsxs("section", { id: "videos", "aria-labelledby": "videos-titulo", className: "section overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -right-40 top-10 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(0,166,255,0.13),transparent_65%)]" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -left-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(164,61,255,0.13),transparent_65%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "container-site relative", children: [
        /* @__PURE__ */ jsx(
          SectionHeading,
          {
            id: "videos-titulo",
            eyebrow: VIDEOS_TEXTOS.selo,
            title: VIDEOS_TEXTOS.titulo,
            highlight: VIDEOS_TEXTOS.destaque,
            subtitle: VIDEOS_TEXTOS.subtitulo
          }
        ),
        /* @__PURE__ */ jsx("div", {id:"lista-videos", className: "mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: visiveis.map((video, i) => /* @__PURE__ */ jsx(VideoCard, { video, index: i }, `${video.url}-${i}`)) }),
        videos.length > 3 && jsx("div",{className:"more-control",children:jsx("button",{type:"button",className:"btn btn-outline","aria-expanded":expandidos,"aria-controls":"lista-videos",onClick:()=>setExpandidos(!expandidos),children:expandidos?"Ver menos vídeos":"Ver mais vídeos"})}),
        maisVideos && /* @__PURE__ */ jsx(Reveal, { className: "mt-12 text-center", children: /* @__PURE__ */ jsxs("a", { href: maisVideos, target: "_blank", rel: "noopener noreferrer", className: "btn btn-primary", children: [
          destinoYouTube ? /* @__PURE__ */ jsx(YouTubeIcon, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(InstagramIcon, { className: "h-4 w-4" }),
          "Ver mais vídeos no YouTube"
        ] }) })
      ] })
    ] });
  }
  function VideoCard({ video, index }) {
    const [tocando, setTocando] = useState(false);
    const valido = videoValido(video);
    const youtubeId = video.tipo === "youtube" ? getYouTubeId(video.url) : null;
    const capa = isFilled(video.capa) ? video.capa : null;
    const IconePlataforma = video.tipo === "youtube" ? YouTubeIcon : video.tipo === "instagram" ? InstagramIcon : Film;
    let midia;
    if (!valido) {
      midia = /* @__PURE__ */ jsx(VideoEmBreve, { tipo: video.tipo });
    } else if (youtubeId) {
      midia = tocando ? /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "absolute inset-0 h-full w-full",
          src: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
          title: video.titulo,
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          referrerPolicy: "strict-origin-when-cross-origin",
          allowFullScreen: true
        }
      ) : /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setTocando(true), "aria-label": `Assistir: ${video.titulo}`, className: "absolute inset-0 h-full w-full", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: capa ?? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
            alt: "",
            loading: "lazy",
            className: "h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          }
        ),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute inset-0 bg-linear-to-t from-ink-950/70 to-transparent" }),
        /* @__PURE__ */ jsx(PlayBadge, {})
      ] });
    } else if (video.tipo === "arquivo") {
      midia = /* @__PURE__ */ jsx(
        "video",
        {
          className: "absolute inset-0 h-full w-full bg-black object-contain",
          src: video.url,
          poster: capa ?? void 0,
          controls: true,
          preload: "metadata",
          playsInline: true
        }
      );
    } else {
      midia = /* @__PURE__ */ jsxs(
        "a",
        {
          href: video.url,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": `Assistir no ${PLATAFORMA[video.tipo]}: ${video.titulo}`,
          className: "absolute inset-0 block",
          children: [
            capa ? /* @__PURE__ */ jsx("img", { src: capa, alt: "", loading: "lazy", className: "h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105" }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#0a2a5c,#1d0b3f_55%,#3b0d5c)]", children: /* @__PURE__ */ jsx(IconePlataforma, { className: "h-24 w-24 text-white/10" }) }),
            /* @__PURE__ */ jsx(PlayBadge, {}),
            /* @__PURE__ */ jsxs("span", { className: "absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink-950/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur", children: [
              "Abrir ",
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3", "aria-hidden": "true" })
            ] })
          ]
        }
      );
    }
    return /* @__PURE__ */ jsx(Reveal, { delay: index % 3 * 100, className: "h-full", children: /* @__PURE__ */ jsxs("article", { id:video.id || "video-"+video.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,""), tabIndex:-1, "data-ancora":true, className: "card-neon card-hover group flex h-full flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "relative aspect-video overflow-hidden bg-ink-950", children: midia }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-5 sm:p-6", children: [
        /* @__PURE__ */ jsxs(youtubeId ? "a" : "p", { href: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : undefined, target: youtubeId ? "_blank" : undefined, rel: youtubeId ? "noopener noreferrer" : undefined, "aria-label": youtubeId ? `Abrir ${video.titulo} no YouTube` : undefined, className: "video-platform flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-neon-cyan", children: [
          /* @__PURE__ */ jsx(IconePlataforma, { className: "h-3.5 w-3.5", "aria-hidden": "true" }),
          " ",
          PLATAFORMA[video.tipo]
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-2 font-display text-2xl uppercase leading-tight tracking-wide text-white", children: valido ? video.titulo : "Vídeo em breve" }),
        valido && video.descricao && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted", children: video.descricao }),
        !valido && CONFIG.mostrarDicasDeEdicao && /* @__PURE__ */ jsx("p", { className: "mt-2 font-mono text-[11px] text-soft", children: "Cole o link em src/config.ts → videos" })
      ] })
    ] }) });
  }
  function PlayBadge() {
    return /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": "true",
        className: "absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-linear-to-br from-neon-blue to-neon-purple text-white shadow-[0_0_40px_-6px_rgba(0,166,255,0.8)] transition-transform duration-500 group-hover:scale-110",
        children: /* @__PURE__ */ jsx(Play, { className: "ml-1 h-6 w-6 fill-current" })
      }
    );
  }
  function VideoEmBreve({ tipo }) {
    return /* @__PURE__ */ jsxs("div", { className: "photo-placeholder absolute inset-0 flex flex-col items-center justify-center gap-3 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-ink-900/70 text-white/70", children: /* @__PURE__ */ jsx(Play, { className: "ml-0.5 h-5 w-5", "aria-hidden": "true" }) }),
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.3em] text-soft", children: tipo === "instagram" ? "Em breve no Instagram" : "Vídeo em breve" })
    ] });
  }

  // ../../src/components/Booking.tsx
  var VAZIO = { nome: "", telefone: "", email: "", tipo: "", data: "", horario: "", local: "", cidade: "", mensagem: "" };
  function validar(v) {
    const erros = {};
    if (v.nome.trim().length < 2) erros.nome = "Informe seu nome.";
    if (onlyDigits(v.telefone).length < 10) erros.telefone = "Informe um telefone com DDD.";
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) erros.email = "Confira o e-mail digitado.";
    if (!v.tipo) erros.tipo = "Selecione o tipo de evento.";
    if (!v.data) {
      erros.data = "Informe a data do evento.";
    } else {
      const data = parseLocalDate(v.data);
      const hoje = /* @__PURE__ */ new Date();
      hoje.setHours(0, 0, 0, 0);
      if (!data) erros.data = "Data inválida.";
      else if (data < hoje) erros.data = "A data não pode estar no passado.";
    }
    if (v.cidade.trim().length < 2) erros.cidade = "Informe a cidade do evento.";
    return erros;
  }
  function montarMensagem(v) {
    const linhas = [
      `Olá! Gostaria de solicitar um orçamento para a ${CONFIG.banda.nome}.`,
      "",
      `*Nome:* ${v.nome.trim()}`,
      `*Telefone/WhatsApp:* ${v.telefone.trim()}`
    ];
    if (v.email.trim()) linhas.push(`*E-mail:* ${v.email.trim()}`);
    linhas.push(`*Tipo de evento:* ${v.tipo}`);
    linhas.push(`*Data:* ${formatDateBR(v.data)}`);
    if (v.horario) linhas.push(`*Horário:* ${v.horario}`);
    if (v.local.trim()) linhas.push(`*Local:* ${v.local.trim()}`);
    linhas.push(`*Cidade:* ${v.cidade.trim()}`);
    if (v.mensagem.trim()) linhas.push("", `*Observações:* ${v.mensagem.trim()}`);
    linhas.push("", "Gostaria de mais informações sobre a contratação.");
    return linhas.join("\n");
  }
  function Booking() {
    const { redes, contato } = CONFIG;
    const irParaFormulario = (event) => {
      event.preventDefault();
      document.getElementById("orcamento")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => document.getElementById("campo-nome")?.focus({ preventScroll: true }), 650);
    };
    return /* @__PURE__ */ jsxs("section", { id: "contrate", "aria-labelledby": "contrate-titulo", className: "section overflow-hidden bg-ink-850/70", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neon-blue/50 to-transparent" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -left-52 top-0 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(0,166,255,0.16),transparent_65%)]" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -right-52 bottom-0 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(164,61,255,0.18),transparent_65%)]" }),
      /* @__PURE__ */ jsx("div", { className: "container-site relative", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-12 lg:gap-14", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5", children: [
          /* @__PURE__ */ jsx(SectionHeading, { id: "contrate-titulo", align: "left", eyebrow: CONTRATACAO.selo, title: CONTRATACAO.titulo, highlight: CONTRATACAO.destaque }),
          /* @__PURE__ */ jsx(Reveal, { delay: 100, children: /* @__PURE__ */ jsx("p", { className: "mt-6 leading-relaxed text-muted", children: CONTRATACAO.texto }) }),
          /* @__PURE__ */ jsx(Reveal, { delay: 150, children: /* @__PURE__ */ jsx("ul", { className: "mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2", children: CONTRATACAO.eventos.map((evento) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-sm text-white/90", children: [
            /* @__PURE__ */ jsx("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neon-blue/15 text-neon-cyan shadow-[inset_0_0_0_1px_rgba(61,227,255,0.35)]", children: /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) }),
            evento
          ] }, evento)) }) }),
          /* @__PURE__ */ jsx(Reveal, { delay: 200, children: /* @__PURE__ */ jsx("a", { href: "#orcamento", onClick: irParaFormulario, className: "btn btn-primary mt-9 w-full sm:w-auto", children: "Solicitar orçamento" }) }),
          /* @__PURE__ */ jsx(Reveal, { delay: 250, children: /* @__PURE__ */ jsx("ol", { className: "mt-10 space-y-5", children: CONTRATACAO.passos.map((passo, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-neon-blue/25 to-neon-purple/25 font-display text-xl text-white shadow-[inset_0_0_0_1px_rgba(61,227,255,0.4)]", children: i + 1 }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-display text-xl uppercase tracking-wide text-white", children: passo.titulo }),
              /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-muted", children: passo.texto })
            ] })
          ] }, passo.titulo)) }) }),
          /* @__PURE__ */ jsxs(Reveal, { delay: 300, className: "mt-10 rounded-2xl border border-white/5 bg-white/[0.02] p-5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.25em] text-soft", children: "Prefere falar direto?" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxs(WhatsAppButton, { className: "btn btn-whats btn-sm", children: [
                /* @__PURE__ */ jsx(WhatsAppIcon, { className: "h-4 w-4" }),
                " Chamar no WhatsApp"
              ] }),
              isUrl(redes.instagram) && /* @__PURE__ */ jsxs("a", { href: redes.instagram, target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline btn-sm", children: [
                /* @__PURE__ */ jsx(InstagramIcon, { className: "h-4 w-4" }),
                " ",
                redes.instagramUsuario
              ] })
            ] }),
            isFilled(contato.email) && /* @__PURE__ */ jsxs("a", { href: `mailto:${contato.email}`, className: "footer-link mt-4 text-sm", children: [
              /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4", "aria-hidden": "true" }),
              " ",
              contato.email
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx(Reveal, { variant: "right", children: /* @__PURE__ */ jsx(BookingForm, {}) }) })
      ] }) })
    ] });
  }
  function BookingForm() {
    const [valores, setValores] = useState(VAZIO);
    const [erros, setErros] = useState({});
    const [estado, setEstado] = useState("inicio");
    const [mensagem, setMensagem] = useState("");
    const [copiado, setCopiado] = useState(false);
    const statusRef = useRef(null);
    const hoje = toISODate(/* @__PURE__ */ new Date());
    const linkWhatsApp = mensagem ? whatsappUrl(mensagem) : null;
    useEffect(() => {
      if (estado !== "inicio") statusRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [estado]);
    const aoDigitar = (event) => {
      const campo2 = event.target.name;
      const valor = campo2 === "telefone" ? formatPhoneBR(event.target.value) : event.target.value;
      setValores((anterior) => ({ ...anterior, [campo2]: valor }));
      if (erros[campo2]) setErros((anterior) => ({ ...anterior, [campo2]: void 0 }));
    };
    const aoEnviar = (event) => {
      event.preventDefault();
      const novosErros = validar(valores);
      setErros(novosErros);
      const primeiroErro = Object.keys(novosErros)[0];
      if (primeiroErro) {
        document.getElementById(`campo-${primeiroErro}`)?.focus();
        return;
      }
      const texto = montarMensagem(valores);
      setMensagem(texto);
      const url = whatsappUrl(texto);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        setEstado("enviado");
      } else {
        setEstado("sem-whatsapp");
      }
    };
    const copiarMensagem = async () => {
      try {
        await navigator.clipboard.writeText(mensagem);
        setCopiado(true);
        window.setTimeout(() => setCopiado(false), 2500);
      } catch {
      }
    };
    const novoPedido = () => {
      setValores(VAZIO);
      setErros({});
      setMensagem("");
      setEstado("inicio");
    };
    const campo = (nome) => ({
      id: `campo-${nome}`,
      name: nome,
      value: valores[nome],
      onChange: aoDigitar,
      "aria-invalid": erros[nome] ? true : void 0,
      "aria-describedby": erros[nome] ? `erro-${nome}` : void 0,
      className: cn("form-input", erros[nome] && "is-invalid")
    });
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -inset-4 rounded-[2rem] bg-[radial-gradient(ellipse_at_top_right,rgba(0,166,255,0.18),transparent_60%)]" }),
      /* @__PURE__ */ jsxs("div", { id: "orcamento", "data-ancora": true, className: "card-neon relative p-6 sm:p-8 lg:p-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "Formulário" }),
            /* @__PURE__ */ jsx("h3", { className: "mt-3 font-display text-4xl uppercase leading-none tracking-wide text-white sm:text-5xl", children: CONTRATACAO.formTitulo }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted", children: CONTRATACAO.formSubtitulo })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-whats/15 text-whats shadow-[inset_0_0_0_1px_rgba(37,211,102,0.35)] sm:flex", children: /* @__PURE__ */ jsx(WhatsAppIcon, { className: "h-7 w-7" }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { noValidate: true, onSubmit: aoEnviar, className: "mt-8 grid gap-5 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx(Campo, { id: "nome", label: "Nome", obrigatorio: true, erro: erros.nome, children: /* @__PURE__ */ jsx("input", { type: "text", autoComplete: "name", placeholder: "Seu nome completo", "aria-required": "true", ...campo("nome") }) }),
          /* @__PURE__ */ jsx(Campo, { id: "telefone", label: "Telefone / WhatsApp", obrigatorio: true, erro: erros.telefone, children: /* @__PURE__ */ jsx("input", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "(00) 00000-0000", "aria-required": "true", ...campo("telefone") }) }),
          /* @__PURE__ */ jsx(Campo, { id: "email", label: "E-mail", erro: erros.email, className: "sm:col-span-2", children: /* @__PURE__ */ jsx("input", { type: "email", autoComplete: "email", placeholder: "seuemail@exemplo.com (opcional)", ...campo("email") }) }),
          /* @__PURE__ */ jsx(Campo, { id: "tipo", label: "Tipo de evento", obrigatorio: true, erro: erros.tipo, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs("select", { "aria-required": "true", ...campo("tipo"), children: [
              /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Selecione" }),
              CONTRATACAO.tiposDeEvento.map((tipo) => /* @__PURE__ */ jsx("option", { value: tipo, children: tipo }, tipo))
            ] }),
            /* @__PURE__ */ jsx(ChevronDown, { className: "pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-soft", "aria-hidden": "true" })
          ] }) }),
          /* @__PURE__ */ jsx(Campo, { id: "data", label: "Data do evento", obrigatorio: true, erro: erros.data, children: /* @__PURE__ */ jsx("input", { type: "date", min: hoje, "aria-required": "true", ...campo("data") }) }),
          /* @__PURE__ */ jsx(Campo, { id: "horario", label: "Horário", erro: erros.horario, children: /* @__PURE__ */ jsx("input", { type: "time", ...campo("horario") }) }),
          /* @__PURE__ */ jsx(Campo, { id: "cidade", label: "Cidade", obrigatorio: true, erro: erros.cidade, children: /* @__PURE__ */ jsx("input", { type: "text", autoComplete: "address-level2", placeholder: "Cidade - UF", "aria-required": "true", ...campo("cidade") }) }),
          /* @__PURE__ */ jsx(Campo, { id: "local", label: "Local do evento", erro: erros.local, className: "sm:col-span-2", children: /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Nome do espaço, salão, bar ou endereço", ...campo("local") }) }),
          /* @__PURE__ */ jsx(Campo, { id: "mensagem", label: "Mensagem / observações", erro: erros.mensagem, className: "sm:col-span-2", children: /* @__PURE__ */ jsx("textarea", { rows: 4, placeholder: "Conte um pouco sobre o evento: número de convidados, duração desejada, músicas especiais...", ...campo("mensagem") }) }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-whats w-full tracking-[0.08em] sm:tracking-[0.14em]", children: [
              /* @__PURE__ */ jsx(WhatsAppIcon, { className: "h-5 w-5" }),
              " Solicitar orçamento pelo WhatsApp"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-3 text-center text-xs leading-relaxed text-soft", children: [
              "Campos com ",
              /* @__PURE__ */ jsx("span", { className: "text-neon-cyan", children: "*" }),
              " são obrigatórios. Seus dados são usados apenas para montar a mensagem de orçamento."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { ref: statusRef, "aria-live": "polite", children: [
          estado === "enviado" && /* @__PURE__ */ jsxs("div", { className: "pop-in mt-6 rounded-2xl border border-whats/30 bg-whats/10 p-5", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 font-semibold text-white", children: [
              /* @__PURE__ */ jsx(CircleCheck, { className: "h-5 w-5 text-whats", "aria-hidden": "true" }),
              " Mensagem pronta!"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: "Abrimos o WhatsApp da banda em uma nova aba com todos os dados do seu evento. É só tocar em enviar." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
              linkWhatsApp && /* @__PURE__ */ jsxs("a", { href: linkWhatsApp, target: "_blank", rel: "noopener noreferrer", className: "btn btn-whats btn-sm", children: [
                /* @__PURE__ */ jsx(WhatsAppIcon, { className: "h-4 w-4" }),
                " Abrir WhatsApp novamente"
              ] }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: novoPedido, className: "btn btn-outline btn-sm", children: "Novo pedido" })
            ] })
          ] }),
          estado === "sem-whatsapp" && /* @__PURE__ */ jsxs("div", { className: "pop-in mt-6 rounded-2xl border border-amber-300/30 bg-amber-300/[0.07] p-5", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 font-semibold text-white", children: [
              /* @__PURE__ */ jsx(CircleAlert, { className: "h-5 w-5 text-amber-300", "aria-hidden": "true" }),
              " WhatsApp da banda ainda não configurado"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: CONFIG.mostrarDicasDeEdicao ? /* @__PURE__ */ jsxs(Fragment2, { children: [
              "Informe o número em ",
              /* @__PURE__ */ jsx("code", { className: "rounded bg-white/10 px-1.5 py-0.5 text-white", children: "src/config.ts" }),
              " (campo",
              " ",
              /* @__PURE__ */ jsx("code", { className: "rounded bg-white/10 px-1.5 py-0.5 text-white", children: "whatsapp" }),
              "). Esta é a mensagem que será enviada:"
            ] }) : /* @__PURE__ */ jsx(Fragment2, { children: "Copie a mensagem abaixo e envie para a banda pelo Instagram." }) }),
            /* @__PURE__ */ jsx("pre", { className: "mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-ink-950/70 p-4 font-sans text-xs leading-relaxed text-white/85", children: mensagem }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxs("button", { type: "button", onClick: copiarMensagem, className: "btn btn-outline btn-sm", children: [
                copiado ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4", "aria-hidden": "true" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4", "aria-hidden": "true" }),
                copiado ? "Copiado!" : "Copiar mensagem"
              ] }),
              isUrl(CONFIG.redes.instagram) && /* @__PURE__ */ jsxs("a", { href: CONFIG.redes.instagram, target: "_blank", rel: "noopener noreferrer", className: "btn btn-ghost btn-sm", children: [
                /* @__PURE__ */ jsx(InstagramIcon, { className: "h-4 w-4" }),
                " Abrir Instagram"
              ] })
            ] })
          ] })
        ] })
      ] })
    ] });
  }
  function Campo({
    id,
    label,
    obrigatorio = false,
    erro,
    className,
    children
  }) {
    return /* @__PURE__ */ jsxs("div", { className, children: [
      /* @__PURE__ */ jsxs("label", { htmlFor: `campo-${id}`, className: "form-label", children: [
        label,
        obrigatorio && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("span", { className: "text-neon-cyan", "aria-hidden": "true", children: [
            " ",
            "*"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: " (obrigatório)" })
        ] })
      ] }),
      children,
      erro && /* @__PURE__ */ jsxs("p", { id: `erro-${id}`, className: "form-error", children: [
        /* @__PURE__ */ jsx(CircleAlert, { className: "h-3.5 w-3.5 shrink-0", "aria-hidden": "true" }),
        erro
      ] })
    ] });
  }

  // ../../src/components/FAQ.tsx
  function FAQ2() {
    const [aberta, setAberta] = useState(0);
    return /* @__PURE__ */ jsxs("section", { id: "faq", "aria-labelledby": "faq-titulo", className: "section overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,166,255,0.12),transparent_65%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "container-site relative grid gap-12 lg:grid-cols-12 lg:gap-14", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4", children: [
          /* @__PURE__ */ jsx(SectionHeading, { id: "faq-titulo", align: "left", eyebrow: FAQ_TEXTOS.selo, title: FAQ_TEXTOS.titulo, highlight: FAQ_TEXTOS.destaque, subtitle: FAQ_TEXTOS.subtitulo }),
          /* @__PURE__ */ jsxs(Reveal, { delay: 150, className: "card-neon mt-8 p-6", children: [
            /* @__PURE__ */ jsx("p", { className: "font-display text-2xl uppercase tracking-wide text-white", children: "Ainda tem dúvidas?" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted", children: "Fale direto com a banda e tire todas as suas dúvidas sobre o show." }),
            /* @__PURE__ */ jsxs(WhatsAppButton, { className: "btn btn-whats btn-sm mt-5", children: [
              /* @__PURE__ */ jsx(WhatsAppIcon, { className: "h-4 w-4" }),
              " Chamar no WhatsApp"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 lg:col-span-8", children: FAQ.map((item, i) => {
          const open = aberta === i;
          const idPergunta = `faq-pergunta-${i}`;
          const idResposta = `faq-resposta-${i}`;
          return /* @__PURE__ */ jsx(Reveal, { as: "li", delay: Math.min(i, 5) * 70, children: /* @__PURE__ */ jsxs("div", { className: cn("card-neon transition-shadow duration-500", open && "shadow-[0_0_50px_-20px_rgba(0,166,255,0.6)]"), children: [
            /* @__PURE__ */ jsx("h3", { children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                id: idPergunta,
                "aria-expanded": open,
                "aria-controls": idResposta,
                onClick: () => setAberta(open ? null : i),
                className: "flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7 sm:py-6",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-baseline gap-4", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-display text-xl text-neon-cyan/80", "aria-hidden": "true", children: String(i + 1).padStart(2, "0") }),
                    /* @__PURE__ */ jsx("span", { className: "text-base font-semibold text-white sm:text-lg", children: item.pergunta })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      "aria-hidden": "true",
                      className: cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                        open ? "rotate-45 border-neon-cyan/60 bg-neon-blue/15 text-neon-cyan" : "border-white/10 text-white/70"
                      ),
                      children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                id: idResposta,
                role: "region",
                "aria-labelledby": idPergunta,
                className: "grid transition-[grid-template-rows] duration-500 ease-out",
                style: { gridTemplateRows: open ? "1fr" : "0fr" },
                children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", inert: !open, children: /* @__PURE__ */ jsx("p", { className: "px-5 pb-6 pl-[3.6rem] leading-relaxed text-muted sm:px-7 sm:pl-[4.35rem]", children: item.resposta }) })
              }
            )
          ] }) }, item.pergunta);
        }) })
      ] })
    ] });
  }

  // ../../src/components/Footer.tsx
  var LINKS_RAPIDOS = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#repertorio", label: "Repertório" },
    { href: "#videos", label: "Vídeos" },
    { href: "#galeria", label: "Galeria" },
    { href: "#agenda", label: "Agenda" },
    { href: "#contrate", label: "Contrate" },
    { href: "#faq", label: "Dúvidas" }
  ];
  function Footer() {
    const ano = (/* @__PURE__ */ new Date()).getFullYear();
    const { contato } = CONFIG;
    const dicas = CONFIG.mostrarDicasDeEdicao;
    const redes = getRedesSociais();
    return /* @__PURE__ */ jsxs("footer", { className: "relative overflow-hidden border-t border-white/5 bg-ink-950 pb-28 pt-16 sm:pb-10 sm:pt-20", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neon-blue/60 to-transparent" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[50rem] max-w-full -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(90,92,255,0.14),transparent_70%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "container-site relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-12 sm:grid-cols-2 lg:grid-cols-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 lg:col-span-4", children: [
            /* @__PURE__ */ jsx(Logo, { esconderSeFaltar: true, imgClassName: "mb-5 h-16 w-auto max-w-[220px] object-contain" }),
            /* @__PURE__ */ jsxs("p", { className: "font-display text-3xl uppercase tracking-wide text-white", children: [
              "Banda ",
              /* @__PURE__ */ jsx("span", { className: "texto-neon", children: "3 em 1" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-sm text-sm leading-relaxed text-muted", children: RODAPE.frase }),
            /* @__PURE__ */ jsx(SocialLinks, { className: "mt-6" })
          ] }),
          /* @__PURE__ */ jsxs("nav", { "aria-label": "Links rápidos", className: "lg:col-span-3", children: [
            /* @__PURE__ */ jsx("h3", { className: "footer-title", children: "Links rápidos" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm", children: LINKS_RAPIDOS.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: link.href, className: "footer-link", children: link.label }) }, link.href)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "footer-title", children: "Redes sociais" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-5 space-y-3 text-sm", children: redes.map(({ id, nome, url, Icone }) => /* @__PURE__ */ jsx("li", { children: url ? /* @__PURE__ */ jsxs("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: "footer-link", children: [
              /* @__PURE__ */ jsx(Icone, { className: "h-4 w-4" }),
              " ",
              nome
            ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2.5 text-soft/70", children: [
              /* @__PURE__ */ jsx(Icone, { className: "h-4 w-4" }),
              " ",
              nome,
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.18em]", children: "(em breve)" })
            ] }) }, id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3", children: [
            /* @__PURE__ */ jsx("h3", { className: "footer-title", children: "Contato" }),
            /* @__PURE__ */ jsxs("ul", { className: "mt-5 space-y-3 text-sm", children: [
              (isFilled(contato.whatsappExibicao) || dicas) && /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(WhatsAppButton, { className: "footer-link", children: [
                /* @__PURE__ */ jsx(WhatsAppIcon, { className: "h-4 w-4" }),
                " ",
                isFilled(contato.whatsappExibicao) ? contato.whatsappExibicao : "WhatsApp (em breve)"
              ] }) }),
              isFilled(contato.email) ? /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { href: `mailto:${contato.email}`, className: "footer-link break-all", children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 shrink-0", "aria-hidden": "true" }),
                " ",
                contato.email
              ] }) }) : dicas && /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2.5 text-soft/70", children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4", "aria-hidden": "true" }),
                " E-mail (em breve)"
              ] }),
              isFilled(contato.localizacao) ? /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2.5 text-muted", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 shrink-0", "aria-hidden": "true" }),
                " ",
                contato.localizacao
              ] }) : dicas && /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2.5 text-soft/70", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4", "aria-hidden": "true" }),
                " Localização (em breve)"
              ] })
            ] }),
            /* @__PURE__ */ jsx("a", { href: "#orcamento", className: "btn btn-primary btn-sm mt-6", children: "Solicitar orçamento" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center text-xs text-soft sm:flex-row sm:text-left", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            "© ",
            ano,
            " ",
            CONFIG.banda.nome,
            ". Todos os direitos reservados."
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "#inicio", className: "footer-link text-xs uppercase tracking-[0.2em]", children: [
            "Voltar ao topo ",
            /* @__PURE__ */ jsx(ArrowUp, { className: "h-3.5 w-3.5", "aria-hidden": "true" })
          ] })
        ] })
      ] })
    ] });
  }

  // ../../src/components/WhatsAppFloat.tsx
  function WhatsAppFloat() {
    const [visivel, setVisivel] = useState(false);
    const url = whatsappUrl(CONFIG.contato.mensagemWhatsApp);
    useEffect(() => {
      const timer = window.setTimeout(() => setVisivel(true), 1200);
      return () => window.clearTimeout(timer);
    }, []);
    return /* @__PURE__ */ jsxs(
      "a",
      {
        href: url ?? "#orcamento",
        target: url ? "_blank" : void 0,
        rel: url ? "noopener noreferrer" : void 0,
        "aria-label": `Conversar com a ${CONFIG.banda.nome} pelo WhatsApp`,
        className: cn(
          "group fixed z-[60] flex items-center transition-all duration-700",
          visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        ),
        style: { right: "max(1.1rem, env(safe-area-inset-right))", bottom: "max(1.1rem, env(safe-area-inset-bottom))" },
        children: [
          /* @__PURE__ */ jsx("span", { className: "glass mr-3 hidden translate-x-2 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block", children: "Fale com a banda" }),
          /* @__PURE__ */ jsx("span", { className: "whats-pulse relative isolate flex h-14 w-14 items-center justify-center rounded-full bg-whats text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.65)] transition-transform duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsx(WhatsAppIcon, { className: "h-7 w-7" }) })
        ]
      }
    );
  }

  // ../../src/App.tsx
  function App() {
    return /* @__PURE__ */ jsxs(Fragment2, { children: [
      /* @__PURE__ */ jsx("a", { href: "#conteudo", className: "skip-link", children: "Pular para o conteúdo" }),
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", { id: "conteudo", children: [
        /* @__PURE__ */ jsx(Hero, {}),
        /* @__PURE__ */ jsx(Marquee, {}),
        /* @__PURE__ */ jsx(About, {}),
        jsx(Repertoire, {}),
        jsx(Videos, {}),
        jsx(Gallery, {}),
        jsx(Agenda, {}),
        /* @__PURE__ */ jsx(Booking, {}),
        /* @__PURE__ */ jsx(FAQ2, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(WhatsAppFloat, {})
    ] });
  }

  // ../../src/main.tsx
  createRoot(document.getElementById("root")).render(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(App, {}) })
  );
})();
/*! Bundled license information:

lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs:
lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs:
lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs:
lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide-react/dist/esm/context.mjs:
lucide-react/dist/esm/Icon.mjs:
lucide-react/dist/esm/createLucideIcon.mjs:
lucide-react/dist/esm/icons/arrow-right.mjs:
lucide-react/dist/esm/icons/arrow-up-right.mjs:
lucide-react/dist/esm/icons/arrow-up.mjs:
lucide-react/dist/esm/icons/calendar-clock.mjs:
lucide-react/dist/esm/icons/calendar-days.mjs:
lucide-react/dist/esm/icons/camera.mjs:
lucide-react/dist/esm/icons/cassette-tape.mjs:
lucide-react/dist/esm/icons/check.mjs:
lucide-react/dist/esm/icons/chevron-down.mjs:
lucide-react/dist/esm/icons/chevron-left.mjs:
lucide-react/dist/esm/icons/chevron-right.mjs:
lucide-react/dist/esm/icons/circle-alert.mjs:
lucide-react/dist/esm/icons/circle-check.mjs:
lucide-react/dist/esm/icons/clock.mjs:
lucide-react/dist/esm/icons/copy.mjs:
lucide-react/dist/esm/icons/external-link.mjs:
lucide-react/dist/esm/icons/film.mjs:
lucide-react/dist/esm/icons/globe.mjs:
lucide-react/dist/esm/icons/guitar.mjs:
lucide-react/dist/esm/icons/headphones.mjs:
lucide-react/dist/esm/icons/info.mjs:
lucide-react/dist/esm/icons/mail.mjs:
lucide-react/dist/esm/icons/map-pin.mjs:
lucide-react/dist/esm/icons/music.mjs:
lucide-react/dist/esm/icons/navigation.mjs:
lucide-react/dist/esm/icons/play.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/sparkles.mjs:
lucide-react/dist/esm/icons/users.mjs:
lucide-react/dist/esm/icons/x.mjs:
lucide-react/dist/esm/icons/zap.mjs:
lucide-react/dist/esm/icons/zoom-in.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.47.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
