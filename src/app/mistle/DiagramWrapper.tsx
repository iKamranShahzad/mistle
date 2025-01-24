import * as go from "gojs";
import { ReactDiagram, ReactPalette } from "gojs-react";
import * as React from "react";
import { saveAs } from "file-saver";
import "./extensions/Figures";
import "./extensions/Arrowheads";
import RescalingTool from "./extensions/RescalingTool";
import DrawCommandHandler from "./extensions/DrawCommandHandler";
import GuidedDraggingTool from "./extensions/GuidedDraggingTool";
import LinkLabelDraggingTool from "./extensions/LinkLabelDraggingTool";
import LinkShiftingTool from "./extensions/LinkShiftingTool";
import "./DiagramWrapper.css";
import { useSession } from "next-auth/react";
import HeaderAvatar from "@/components/ui/headerAvatar";
import Topleftbar from "./components/topleftbar";
import Leftbar from "./components/leftbar";
import Settings from "./components/settings";
import { toast } from "sonner";
import TextStyles from "./components/TextStyles";
import DiagramProvider from "./extensions/DiagramProvidor";
import DiagramIDProvidor from "./extensions/DiagramIDProvidor";

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

const DiagramWrapper: React.FC<DiagramProps> = (props) => {
  const { data: session }: any = useSession();
  const diagramRef = React.useRef<ReactDiagram>(null);
  const [grid, setGrid] = React.useState(true);
  const [guide, setGuide] = React.useState(true);
  const [fscreen, setFscreen] = React.useState(false);
  const [pallete, setPallete] = React.useState(false);
  const [textStyles, setTextStyles] = React.useState(false);
  const [linkType, setLinkType] = React.useState(false);
  const linkChoiceRef = React.useRef(linkType);
  const [diagramName, setDiagramName] = React.useState("");
  const [format, setFormat] = React.useState("");
  const [backgroundColor, setBackgroundColor] = React.useState("");
  const [theme, setTheme] = React.useState(true);
  const diagramStyle = { backgroundColor: theme ? "#1a1a1a" : "#d9d9d9" };
  const [loading, setLoading] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("option1");
  const [cloudLoading, setCloudLoading] = React.useState(true);
  const [singleRender, setSingleRender] = React.useState(true);
  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const toggleGrid = () => {
    setGrid((prevGrid) => {
      const newGrid = !prevGrid;
      localStorage.setItem("grid", JSON.stringify(newGrid));
      return newGrid;
    });
  };

  const handleToggleGuides = () => {
    setGuide((prevGuide) => !prevGuide);
    if (!guide) {
      toast.info("Nodes Alignment Guides are Enabled");
    } else {
      toast.warning("Nodes Alignment Guides are Disabled");
    }
  };

  const handleThemeChanges = () => {
    setTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem("theme", JSON.stringify(newTheme));
      changeGridStroke(
        diagramRef.current?.getDiagram(),
        theme ? "#b3b3b3" : "#000000"
      );
      return newTheme;
    });
  };

  const togglePalette = () => {
    setPallete((prevPallete: any) => !prevPallete);
    setTextStyles(false);
  };

  const toggleTextStyles = () => {
    setTextStyles((prevTextStyles) => !prevTextStyles);
    setPallete(false);
  };

  React.useEffect(() => {
    // Load diagram name from sessionStorage on component mount
    const savedDiagramName = sessionStorage.getItem("diagramName");
    const savedGrid = localStorage.getItem("grid");
    const savedTheme = localStorage.getItem("theme");
    if (savedDiagramName) {
      setDiagramName(savedDiagramName);
    }
    if (savedTheme !== null) {
      const isTheme = JSON.parse(savedTheme);
      setTheme(isTheme);
      changeGridStroke(
        diagramRef.current?.getDiagram(),
        isTheme ? "#000000" : "#b3b3b3"
      );
    }
    if (savedGrid !== null) {
      setGrid(JSON.parse(savedGrid));
    }
    document.title = "Mistle App";
    const timer = setTimeout(() => {
      setLoading(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    linkChoiceRef.current = linkType;
  }, [linkType]);

  const handleNameChange = (e: any) => {
    const newName = e.target.value;
    setDiagramName(newName);
    // Save diagram name to sessionStorage
    sessionStorage.setItem("diagramName", newName);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.target.blur(); // Remove focus from the input field
    }
  };

  const colors = {
    // Pre-defined colors for Node & Link's context menu
    red: "#ff3333",
    blue: "#3358ff",
    green: "#25ad23",
    magenta: "#d533ff",
    purple: "#7d33ff",
    orange: "#ff6233",
    brown: "#8e571e",
    white: "#ffffff",
    black: "#000000",
    beige: "#fffcd5",
    extralightblue: "#d5ebff",
    extralightred: "#f2dfe0",
    lightblue: "#a5d2fa",
    lightgray: "#cccccc",
    lightgreen: "#b3e6b3",
    lightred: "#fcbbbd",
  };

  let nodeDataArray: any, linkDataArray: any;
  switch (
    selectedOption // Switching Between different diagram types in Palette
  ) {
    case "option1":
      nodeDataArray = [
        {
          key: "0",
          fill: "white",
          text: "Start",
          shape: "Start",
          size: "80 49.66259747882222",
          scale: 0.9330583020375427,
        },
        {
          key: "1",
          fill: "white",
          text: "Yes/No",
          shape: "Decision",
          size: "160 67.58373413085937",
          scale: 1.0111966252400153,
        },
        {
          key: "2",
          fill: "white",
          text: "Process",
          shape: "Process",
          size: "100 44.791867065429685",
          scale: 0.987038367135324,
        },
        {
          key: "3",
          fill: "white",
          text: "Input",
          shape: "Input",
          size: "90.607383731972 44.791867065429685",
          scale: 1.0133666785434807,
        },
      ];
      linkDataArray = [];
      break;
    case "option2":
      nodeDataArray = [
        {
          key: "4",
          text: "",
          fill: "white",
          shape: "Start",
          size: "60 60",
          scale: 1.0286271826369033,
        },
        {
          key: "5",
          fill: "white",
          text: "State-Box",
          shape: "State Box",
          size: "103.83214315260481 40.314714563737624",
          scale: 0.9835622417604366,
        },
        {
          key: "6",
          fill: "white",
          text: "Condition",
          shape: "Guard",
          size: "200 71.80454081282777",
          scale: 0.9888027681471586,
        },
        {
          key: "7",
          fill: "white",
          text: "",
          shape: "EndState",
          size: "60 60",
          scale: 1.0233823431914142,
        },
        {
          key: "8",
          fill: "white",
          text: "",
          shape: "Time Event",
          size: "50 73.16746826171874",
          scale: 0.9622588604977039,
        },
        {
          key: "9",
          fill: "white",
          text: "",
          shape: "Flow Final",
          size: "42 40",
          scale: 0.9058865408351744,
        },
        {
          key: "10",
          fill: "white",
          text: "",
          shape: "Fork",
          size: "140 20",
          scale: 0.966603355221644,
        },
      ];
      linkDataArray = [];

      break;
    case "option3":
      nodeDataArray = [
        {
          key: "11",
          fill: "white",
          text: "Block",
          shape: "Block",
          size: "80 49.66259747882222",
          scale: 0.9915213081287855,
        },
      ];
      linkDataArray = [];

      break;
    case "option4":
      nodeDataArray = [
        {
          key: "12",
          fill: "white",
          text: "",
          shape: "Actor",
          size: "50 74.87081570095485",
          scale: 0.9781140692133911,
        },
        {
          key: "13",
          fill: "white",
          text: ":Object",
          shape: "Object",
          size: "80 37.19814475843685",
          scale: 0.950948535677566,
        },
        {
          key: "14",
          fill: "white",
          text: "UseCase",
          shape: "Start",
          size: "136 60.66259747882222",
          scale: 1.0324379310251932,
        },
      ];
      linkDataArray = [
        // the Palette also has a disconnected Link, which the user can drag-and-drop
        {
          points: new go.List(/*go.Point*/).addAll([
            new go.Point(20, 20),
            new go.Point(50, 60),
          ]),
          routing: go.Routing.Normal,
        },
      ];

      break;
    case "option5":
      nodeDataArray = [
        {
          key: "15",
          fill: "white",
          text: "Strong Entity",
          shape: "Strong Entity",
          size: "143.92176818847656 90",
          scale: 0.7441059662527992,
        },
        {
          key: "16",
          fill: "white",
          text: "Weak Entity",
          shape: "Weak Entity",
          size: "146.08428955078125 90",
          scale: 0.7542677487462591,
        },
        {
          key: "17",
          fill: "white",
          text: "Associative \nEntity",
          shape: "Associative Entity",
          size: "256.27837057505906 114.79186706542973",
          scale: 0.5862092019808233,
        },
        {
          key: "18",
          fill: "white",
          text: "Relationship",
          shape: "Decision",
          size: "252.43566135141995 124.79186706542968",
          scale: 0.5882737953386574,
        },
        {
          key: "19",
          fill: "white",
          text: "Weak \nRelationship",
          shape: "Weak Relationship",
          size: "252.43566135141995 124.79186706542968",
          scale: 0.5882737953386574,
        },
        {
          key: "20",
          fill: "white",
          text: "Attribute",
          shape: "Start",
          size: "128.3261070068564 79.66259747882222",
          scale: 0.753806446400175,
        },
        {
          key: "21",
          fill: "white",
          text: "Multivalued \nAttribute",
          shape: "Multivalued",
          size: "170 99.66259747882222",
          scale: 0.753806446400175,
        },
      ];
      linkDataArray = [];

      break;
    case "option6":
      nodeDataArray = [
        {
          key: "22",
          fill: "white",
          text: ":Object",
          shape: "Object",
          size: "80 37.19814475843685",
          scale: 1.0119183528916773,
        },
        {
          key: "23",
          fill: "white",
          text: "",
          shape: "Execution",
          size: "20 140",
          scale: 0.7400304640899217,
        },
        {
          key: "24",
          fill: "white",
          text: "",
          shape: "Actor",
          size: "50 74.87081570095485",
          scale: 0.9667855802267132,
        },
        {
          key: "25",
          fill: "white",
          text: "alt",
          shape: "Frag",
          size: "620 170",
          scale: 0.7748706002284852,
          alignTL: new go.Spot(0, 0),
        },
        {
          key: "26",
          fill: "white",
          text: "",
          shape: "Destruction Event",
          size: "30 29.500000000000014",
          scale: 1.0009934551369115,
        },
      ];
      linkDataArray = [
        {
          points: new go.List(/*go.Point*/).addAll([
            new go.Point(30, 0),
            new go.Point(30, 40),
          ]),
          routing: go.Routing.Normal, // Using Straight routing
          dash: [4, 4],
          dir: 0,
        },
      ];

      break;
    case "option7":
      nodeDataArray = [
        {
          key: "27",
          fill: "white",
          text: "<<type>>\nonClick",
          customMinsize: new go.Size(50, 50),
          size: "250 70",
          shape: "Component",
          scale: 1,
        },
        {
          key: "28",
          fill: "white",
          text: "<<type>>\nrunMe.exe",
          customMinsize: new go.Size(300, 300),
          alignTL: new go.Spot(0.5, 0),
          size: "300 300",
          shape: "ComponentBox",
          scale: 1,
        },
        {
          key: "29",
          fill: "white",
          text: "",
          size: "60 60",
          shape: "Operator",
          scale: 1,
        },
        {
          key: "30",
          fill: "white",
          text: "<<Artifact>>\nclickMe",
          customMinsize: new go.Size(50, 50),
          size: "250 70",
          shape: "CompDep",
          scale: 1,
        },
        {
          key: "31",
          fill: "white",
          text: "<<Main System>>\nSoftware Interface",
          customMinsize: new go.Size(300, 200),
          alignTL: new go.Spot(0.5, 0),
          size: "300 300",
          shape: "Cube",
          scale: 1,
        },
      ];
      linkDataArray = [];

      break;
    default:
      nodeDataArray = [];
  }

  function toggleGuidedDraggingTool() {
    // Function to toggle GuidedDraggingTool
    const diagram: any = diagramRef.current?.getDiagram();
    var tool = diagram?.toolManager.draggingTool;
    if (tool instanceof GuidedDraggingTool) {
      diagram.toolManager.draggingTool = new go.DraggingTool();
      diagram.toolManager.draggingTool.dragsLink = true;
    } else {
      diagram.toolManager.draggingTool = new GuidedDraggingTool();
      diagram.toolManager.draggingTool.horizontalGuidelineColor = "dodgerblue";
      diagram.toolManager.draggingTool.verticalGuidelineColor = "dodgerblue";
      diagram.toolManager.draggingTool.centerGuidelineColor = "indianred";
      diagram.toolManager.draggingTool.guidelineWidth = 1;
      diagram.toolManager.draggingTool.dragsLink = true;
    }
  }

  const toggleFullScreen = () => {
    // Function to toggle FullScreen
    if (!document.fullscreenElement) {
      setFscreen(true);
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      setFscreen(false);
      document.exitFullscreen();
    }
  };

  // Local Storage Implementation
  const saveDiagramToLocalStorage = () => {
    const diagram = diagramRef.current ? diagramRef.current.getDiagram() : null;
    if (!diagram || !diagram.model) return; // Check if diagram exists

    // Check if the URL contains "diagramID"
    if (window.location.href.includes("dID=")) {
      return; // Don't save if "dID" is found in the URL
    }

    const jsonData = diagram.model.toJson();
    localStorage.setItem("diagramData", jsonData);
  };

  const retreiveDiagramFromProvidor = (urlDiagram: string) => {
    // Function to retrieve Diagram from DiagramProvidor
    const returnDiagram = DiagramProvider(urlDiagram);
    const diagram = diagramRef.current ? diagramRef.current.getDiagram() : null;
    if (returnDiagram && diagram && diagram.model) {
      diagram.model = go.Model.fromJson(returnDiagram);
    }
  };

  const retreiveDiagramIDFromProvidor = async (
    // Function to retrieve Diagram ID from DiagramIDProvidor
    urlDiagramID: string,
    userID: string
  ) => {
    const returnDiagram = await DiagramIDProvidor(urlDiagramID, userID);
    const returnDiagramData = returnDiagram.data;
    const diagram = diagramRef.current ? diagramRef.current.getDiagram() : null;
    if (returnDiagramData && diagram && diagram.model) {
      diagram.model = go.Model.fromJson(returnDiagramData);
      setDiagramName(returnDiagram.name);
      setCloudLoading(false);
    } else {
      toast.error("Invalid Diagram Requested!");
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("dID"); // Remove any existing 'diagram' parameter
      window.history.pushState({}, "", currentUrl); // Update the URL without reloading the page
      setCloudLoading(false);
    }
  };

  const retrieveDiagramFromLocalStorage = () => {
    // Function to retrieve Diagram from Local Storage
    const diagramData = localStorage.getItem("diagramData");
    const diagram = diagramRef.current ? diagramRef.current.getDiagram() : null;
    if (diagramData && diagram && diagram.model) {
      diagram.model = go.Model.fromJson(diagramData);
    }
  };

  // Save diagram data to local storage when the user leaves the webpage
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      saveDiagramToLocalStorage();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Retrieve diagram data after 50ms
  React.useEffect(() => {
    const currentUrl = window.location.pathname;
    const targetUrl = "/mistle";
    const urlDiagram = window.location.search.split("?diagram=")[1];
    const urlDiagramID = window.location.search.split("?dID=")[1];

    const timeout = setTimeout(() => {
      if (urlDiagram) {
        retreiveDiagramFromProvidor(urlDiagram);
        setCloudLoading(false);
      }
      if (currentUrl === targetUrl && !urlDiagramID && !urlDiagram) {
        retrieveDiagramFromLocalStorage();
        setCloudLoading(false);
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    // Retrieve diagram data from Local Storage on page load
    const urlDiagramID = window.location.search.split("?dID=")[1];
    const userID = session?.user.id;
    if (urlDiagramID && userID && singleRender) {
      retreiveDiagramIDFromProvidor(urlDiagramID, userID);
      setSingleRender(false);
    }
  }, [session, singleRender]);

  React.useEffect(() => {
    // Hangle Diagram Changes on Page Load
    const diagram = diagramRef.current?.getDiagram();

    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener("ChangedSelection", props.onDiagramEvent);
    }

    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener("ChangedSelection", props.onDiagramEvent);
      }
    };
  }, [props.onDiagramEvent]);

  React.useEffect(() => {
    // Handle Grid Changes on Page Load
    const diagram = diagramRef.current?.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.grid.visible = grid;
      diagram.toolManager.draggingTool.isGridSnapEnabled = grid;
      diagram.toolManager.resizingTool.isGridSnapEnabled = grid;
      diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(5, 5);
    }
  }, [grid]);

  const initDiagram = (): go.Diagram => {
    // Initialize Diagram Function with all the configurations and tools defined
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, {
      draggingTool: new GuidedDraggingTool(), // defined in GuidedDraggingTool.js
      "draggingTool.horizontalGuidelineColor": "dodgerblue",
      "draggingTool.verticalGuidelineColor": "dodgerblue",
      "draggingTool.centerGuidelineColor": "indianred",
      "draggingTool.guidelineWidth": 1,
      "draggingTool.dragsLink": true,
      "linkingTool.isUnconnectedLinkValid": true,
      "linkingTool.portGravity": 15,
      "relinkingTool.isUnconnectedLinkValid": true,
      "relinkingTool.portGravity": 15,
      "relinkingTool.fromHandleArchetype": $(go.Shape, "Square", {
        // Relinking Tool Configurations
        segmentIndex: 0,
        cursor: "pointer",
        desiredSize: new go.Size(8, 8),
        fill: "white",
        stroke: "black",
      }),
      "relinkingTool.toHandleArchetype": $(go.Shape, "Square", {
        // Relinking Tool Configurations
        segmentIndex: -1,
        cursor: "pointer",
        desiredSize: new go.Size(8, 8),
        fill: "white",
        stroke: "black",
      }),
      "linkReshapingTool.handleArchetype": $(go.Shape, "Square", {
        // Link Reshaping Tool Configurations
        desiredSize: new go.Size(5, 5),
        fill: "lightblue",
        stroke: "deepskyblue",
      }),
      "rotatingTool.snapAngleEpsilon": 45, // RotationTool Configurations
      "rotatingTool.handleDistance": 20,

      "undoManager.isEnabled": true,
      commandHandler: $(DrawCommandHandler), // defined in DrawCommandHandler.js
      "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
      "clickCreatingTool.archetypeNodeData": {
        text: "New Node",
        fill: "white",
        stroke: "black",
        strokeWidth: "2",
      },
      "commandHandler.archetypeGroupData": {
        text: "Name This Group",
        isGroup: true,
      },
      "animationManager.isInitial": false, // To use custom initial animation instead
      InitialLayoutCompleted: animateFadeIn,
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          data.key = k;
          return k;
        },
      }),
    });

    function CMButton(options: any) {
      // Context Menu Button Function (this renderes the contextmenu button for Nodes & Links)
      return $(
        go.Shape,
        {
          fill: "#4657C7",
          stroke: "rgba(0, 0, 0, 0)",
          strokeWidth: 15,
          maxSize: new go.Size(16, 5),
          background: "transparent",
          geometryString:
            "F1 M0 0 b 0 360 -4 0 4 z M10 0 b 0 360 -4 0 4 z M20 0 b 0 360 -4 0 4",
          isActionable: true,
          cursor: "context-menu",
          mouseEnter: (e: any, shape: any) => (shape.fill = "dodgerblue"),
          mouseLeave: (e: any, shape: any) => (shape.fill = "#4657C7"),
          click: (e: any, shape: any) => {
            e.diagram.commandHandler.showContextMenu(shape.part.adornedPart);
          },
        },
        options || {}
      );
    }

    function animateFadeIn(e: any) {
      // Function to animate Fade In on Diagram Load
      var diagram = e.diagram;
      var animation = new go.Animation();
      animation.isViewportUnconstrained = true;
      animation.easing = go.Animation.EaseOutExpo; // Looks better for a fade in animation
      animation.duration = 900;
      animation.add(
        diagram,
        "position",
        diagram.position
          .copy()
          .offset(0, diagram instanceof go.Palette ? 200 : -200),
        diagram.position
      );
      animation.add(diagram, "opacity", 0, 1);
      animation.start();
    }

    go.AnimationManager.defineAnimationEffect(
      // Custom Animation Effect
      "bounceDelete",
      (
        obj: any,
        startValue,
        endValue,
        easing,
        currentTime,
        duration,
        animation
      ) => {
        var animationState = animation.getTemporaryState(obj);
        if (animationState.initial === undefined) {
          // Set the initial positions as part of the animationState data
          animationState.yPos = obj.location.y;
          animationState.xPos = obj.location.x;
          animationState.yVelo = 0;
          animationState.xVelo = 0;
          animationState.newTime = 0;
          animationState.oldTime = 0;
          animationState.initial = true;
        }
        obj.location = getPointBounceDelete(
          currentTime,
          obj,
          animationState,
          obj.diagram
        );
      }
    );

    // Get the point the object should be at based upon the time and original point
    function getPointBounceDelete( // Function to animate Bounce Delete
      currentTime: any,
      obj: any,
      animationState: any,
      diagram: any
    ) {
      if (diagram === null)
        return new go.Point(animationState.xPos, animationState.yPos);
      let height = obj.actualBounds.height;
      animationState.newTime = currentTime;
      // Animation uses a change in time in order to be more consistant
      let delTime = (animationState.newTime - animationState.oldTime) / 3;
      animationState.yVelo += 0.05 * delTime;
      // Add a slight easing to the x movement at the beginning of the animation
      if (currentTime < 200) {
        animationState.xVelo = currentTime / 300;
      }
      // Adjust positions based on the velocities and the change in time
      animationState.yPos += animationState.yVelo * delTime;
      animationState.xPos += animationState.xVelo * delTime;

      if (animationState.yPos > diagram.viewportBounds.height / 2 - height) {
        animationState.yVelo = -0.75 * animationState.yVelo;
        animationState.yPos = diagram.viewportBounds.height / 2 - height;
      }
      let myPoint = new go.Point(animationState.xPos, animationState.yPos);
      // Get the new old time for use in the next iteration
      animationState.oldTime = animationState.newTime;
      return myPoint;
    }

    diagram.addDiagramListener("SelectionDeleting", (e) => {
      // Selection Deleting Event (Delete Animation)
      var animation = new go.Animation();
      var diagram = e.diagram;
      e.subject.each((p: any) => {
        var part = p.copy();
        animation.addTemporaryPart(part, diagram);
        var initPosition = part.position.copy();
        part.locationSpot = go.Spot.Center;
        part.position = initPosition;
        animation.duration = 220;
        animation.add(part, "scale", part.scale, 0.01);
      });
      animation.start();
    });

    diagram.addDiagramListener("ClipboardPasted", (e) => {
      // Clipboard Pasted Event (Paste Animation)
      var animation = new go.Animation();
      e.subject.each((part: any) => {
        addCreatedPart(part, animation);
      });
      animation.start();
    });

    diagram.addDiagramListener("PartCreated", (e) => {
      // Part Created Event (Create Animation)
      changeColor(e.diagram, colors.black, "color");
      // From ClickCreatingTool
      var animation = new go.Animation();
      addCreatedPart(e.subject, animation);
      animation.start();
    });

    diagram.addDiagramListener("ExternalObjectsDropped", (e) => {
      // External Objects Dropped Event (Palette Shapes)
      // Check if the dropped object is a link
      if (e.diagram.selection.first() instanceof go.Link) {
        changeColor(e.diagram, "#595959", "color");
      } else {
        changeColor(e.diagram, colors.black, "color");
      }
    });

    diagram.addDiagramListener("LinkDrawn", (e) => {
      // Link Drawn Event (Link Creation Handler)
      var link = e.subject;
      if (linkChoiceRef.current) {
        link.routing = go.Routing.Normal;
        link.fromEndSegmentLength = 0;
        link.toEndSegmentLength = 0;
      } else {
        link.routing = go.Routing.AvoidsNodes;
        link.fromEndSegmentLength = 30;
        link.toEndSegmentLength = 30;
      }
      changeColor(e.diagram, "#595959", "color");
    });

    diagram.addDiagramListener("SelectionGrouped", (e) => {
      // Selection Grouped Event (Grouping Handler)
      changeColor(e.diagram, "white", "color");
      changeColor(e.diagram, "rgba(128,128,128,0.2)", "fill");
    });

    function addCreatedPart(part: any, animation: any) {
      animation.add(part, "scale", 0.01, part.scale);
      animation.duration = 160;
    }

    function makePort(name: any, spot: any, output: any, input: any) {
      // Function to create Ports
      return $(go.Shape, "Circle", {
        fill: null,
        stroke: null,
        desiredSize: new go.Size(8, 8),
        alignment: spot,
        alignmentFocus: spot,
        portId: name,
        fromSpot: spot,
        toSpot: spot,
        fromLinkable: output,
        toLinkable: input,
        cursor: "crosshair",
      });
    }

    const tempfromnode = $(
      // Temporary node outline styles
      go.Node,
      { layerName: "Tool" },
      $(go.Shape, "RoundedRectangle", {
        stroke: "indianred",
        strokeWidth: 3,
        fill: null,
        portId: "",
        width: 1,
        height: 1,
      })
    );

    const temptonode = $(
      // Temporary node outline styles
      go.Node,
      { layerName: "Tool" },
      $(go.Shape, "RoundedRectangle", {
        stroke: "dodgerblue",
        strokeWidth: 3,
        fill: null,
        portId: "",
        width: 1,
        height: 1,
      })
    );

    diagram.toolManager.linkingTool.temporaryLink = $(
      // Temporary node linking style
      go.Link,
      { layerName: "Tool" },
      $(go.Shape, {
        stroke: "dodgerblue",
        strokeWidth: 2,
        strokeDashArray: [4, 2],
      })
    );

    diagram.toolManager.relinkingTool.temporaryLink = $(
      // Temporary node relinking style
      go.Link,
      { layerName: "Tool" },
      $(go.Shape, {
        stroke: "dodgerblue",
        strokeWidth: 2,
        strokeDashArray: [4, 2],
      })
    );

    diagram.toolManager.mouseMoveTools.insertAt(0, new LinkLabelDraggingTool()); // Custom Link Label Dragging Tool Initialization
    diagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
    diagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;
    diagram.toolManager.linkingTool.temporaryToNode = temptonode;
    diagram.toolManager.linkingTool.temporaryToPort = temptonode.port;
    diagram.scrollMode = go.ScrollMode.Infinite;
    diagram.grid = $(
      // Grid Configuration
      go.Panel,
      "Grid",
      {
        name: "GRID",
        visible: grid, //We'll use button to set this to true/false dynamically
        gridCellSize: new go.Size(10, 10),
        gridOrigin: new go.Point(0, 0),
      },
      $(go.Shape, "LineH", {
        strokeWidth: 0.5,
        interval: 1,
      }),
      $(go.Shape, "LineH", {
        strokeWidth: 0.5,
        interval: 5,
      }),
      $(go.Shape, "LineH", {
        strokeWidth: 1.0,
        interval: 10,
      }),
      $(go.Shape, "LineV", {
        strokeWidth: 0.5,
        interval: 1,
      }),
      $(go.Shape, "LineV", {
        strokeWidth: 0.5,
        interval: 5,
      }),
      $(go.Shape, "LineV", {
        strokeWidth: 1.0,
        interval: 10,
      })
    );

    diagram.toolManager.draggingTool.isGridSnapEnabled = grid;
    diagram.toolManager.resizingTool.isGridSnapEnabled = grid;
    diagram.toolManager.mouseDownTools.add(new RescalingTool()); // Custom Rescaling Tool Initialization
    diagram.toolManager.mouseDownTools.add($(LinkShiftingTool)); // Custom Link Shifting Tool Initialization

    diagram.nodeTemplate = $(
      // Node Template for All the Nodes
      go.Node,
      "Spot",
      {
        minSize: new go.Size(30, 20),
        locationSpot: go.Spot.Center,
        rotatable: true,
        resizable: true,
        layerName: "Foreground",
        rotationSpot: go.Spot.Center,
        rotateAdornmentTemplate: $(
          go.Adornment, // the rotation handle's custom adornment
          { locationSpot: go.Spot.Bottom },
          $(go.Shape, "BpmnActivityLoop", {
            width: 12,
            height: 12,
            cursor: "pointer",
            background: "transparent",
            stroke: "dodgerblue",
            strokeWidth: 2,
          })
        ),
        selectionObjectName: "SHAPE",
        doubleClick: (e: any, node: any) => {
          e.diagram.model.commit((m: any) => {
            if (!node.data.text || /^\s*$/.test(node.data.text)) {
              m.set(node.data, "text", "AddText");
            }
          });
        },
      },
      new go.Binding("minSize", "customMinsize"),
      new go.Binding("layerName", "layerName").makeTwoWay(),
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
        go.Size.stringify
      ),
      new go.Binding("angle").makeTwoWay(), // Binding for rotation
      new go.Binding("scale").makeTwoWay(), // Binding for scaling
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        // Node's Default Shape
        go.Panel,
        "Auto",
        $(
          go.Shape,
          "RoundedRectangle",
          {
            name: "SHAPE",
            fill: colors.white,
            stroke: "black",
            strokeWidth: 2,
            portId: "",
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
            fromLinkable: true,
            toLinkable: true,
            fromLinkableSelfNode: true,
            toLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkableDuplicates: true,
            cursor: "pointer",
          },
          new go.Binding("fill"),
          new go.Binding("stroke", "color"),
          new go.Binding("strokeWidth", "thickness"),
          new go.Binding("strokeDashArray", "dash"),
          new go.Binding("figure", "shape", (shape) => {
            // Mapping the shape property to the corresponding figure property for the all shapes
            switch (shape) {
              case "Start":
                return "Ellipse";
              case "Process":
                return "Rectangle";
              case "Decision":
                return "Diamond";
              case "Input":
                return "Input";
              case "Initial State":
                return "Circle";
              case "State Box":
                return "RoundedRectangle";
              case "EndState":
                return "EndState";
              case "Guard":
                return "Diamond";
              case "Actor":
                return "Actor";
              case "Object":
                return "Rectangle";
              case "Time Event":
                return "Collate";
              case "Flow Final":
                return "Junction";
              case "Fork":
                return "RoundedRectangle";
              case "File":
                return "File";
              case "Strong Entity":
                return "Rectangle";
              case "Weak Entity":
                return "WeakEntity";
              case "Associative Entity":
                return "AssociativeEntity";
              case "Weak Relationship":
                return "WeakRelationship";
              case "Multivalued":
                return "Multivalued";
              case "Execution":
                return "RoundedRectangle";
              case "Frag":
                return "Frag";
              case "Destruction Event":
                return "IrritationHazard";
              case "Component":
                return "Comp";
              case "ComponentBox":
                return "Comp";
              case "Operator":
                return "Operator";
              case "Cube":
                return "CubeBox";
              case "CompDep":
                return "CompDep";
              // Add more shape mappings as needed
              default:
                return "RoundedRectangle"; // Default to RoundedRectangle if shape is not recognized
            }
          })
        ),
        $(go.Shape, {
          width: 80,
          height: 35,
          cursor: "default",
          strokeWidth: 0,
          fill: "transparent",
        }),
        $(
          go.TextBlock,
          {
            textAlign: "center",
            isMultiline: true,
            overflow: go.TextOverflow.Ellipsis,
            margin: 6,
            cursor: "default",
            editable: true,
            isUnderline: false,
            font: "400 1.2rem Arial, sans-serif",
            stroke: "black",
          },
          new go.Binding("alignment", "alignTL"),
          new go.Binding("alignmentFocus", "alignTL"),
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "color"),
          new go.Binding("font", "fontType"),
          new go.Binding("isUnderline", "setUnderline")
        )
      ),
      makePort("T", go.Spot.Top, true, true),
      makePort("L", go.Spot.Left, true, true),
      makePort("R", go.Spot.Right, true, true),
      makePort("B", go.Spot.Bottom, true, true),
      {
        // handle mouse enter/leave events to show/hide the ports
        mouseEnter: (e, node: any) => {
          showSmallPorts(node, true);
        },
        mouseLeave: (e, node: any) => {
          showSmallPorts(node, false);
        },
      }
    );

    function showSmallPorts(node: go.Node, show: boolean) {
      // Function to show/hide ports
      node.ports.each((port: any) => {
        if (port.portId !== "") {
          // don't change the default port, which is the big shape
          port.fill = show ? "#c0a7fc" : null;
          port.stroke = show ? "#9064f5" : null;
        }
      });
    }

    function showGroupPorts(group: go.Group, show: boolean) {
      // Function to show/hide group ports
      group.ports.each((port: any) => {
        if (port.portId !== "") {
          port.fill = show ? "#c0a7fc" : null;
          port.stroke = show ? "#9064f5" : null;
        }
      });
    }

    diagram.nodeTemplate.selectionAdornmentTemplate = $(
      // Node Selection Adornment Template (highlights when selected)
      go.Adornment,
      "Spot",
      $(
        go.Panel,
        "Auto",
        $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
        $(go.Placeholder, { margin: 1.5 })
      ),
      CMButton({
        alignment: go.Spot.TopRight,
        alignmentFocus: go.Spot.BottomRight,
      })
    );

    function ClickFunction(propname: any, value: any) {
      // Function to handle click events on context menu buttons
      return (e: any, obj: any) => {
        e.handled = true;
        e.diagram.model.commit((m: any) => {
          m.set(obj.part.adornedPart.data, propname, value);
        });
      };
    }

    function ColorButton(color: any, propname: any) {
      // Function to create color buttons for context menus
      if (!propname) propname = "color";
      return $(go.Shape, {
        width: 16,
        height: 16,
        stroke: "lightgray",
        fill: color,
        margin: 1.5,
        background: "transparent",
        mouseEnter: (e: any, shape: any) => (shape.stroke = "dodgerblue"),
        mouseLeave: (e: any, shape: any) => (shape.stroke = "lightgray"),
        click: ClickFunction(propname, color),
        contextClick: ClickFunction(propname, color),
      });
    }

    function LightFillButtons() {
      // Function to create light color buttons for context menus
      // used by multiple context menus
      return [
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ColorButton(colors.white, "fill"),
            ColorButton(colors.beige, "fill"),
            ColorButton(colors.extralightblue, "fill"),
            ColorButton(colors.extralightred, "fill")
          )
        ),
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ColorButton(colors.lightgray, "fill"),
            ColorButton(colors.lightgreen, "fill"),
            ColorButton(colors.lightblue, "fill"),
            ColorButton(colors.lightred, "fill")
          )
        ),
      ];
    }

    function DarkColorButtons() {
      // Function to create dark color buttons for context menus
      // used by multiple context menus
      return [
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ColorButton(colors.black, ""),
            ColorButton(colors.green, ""),
            ColorButton(colors.blue, ""),
            ColorButton(colors.red, "")
          )
        ),
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ColorButton(colors.white, ""),
            ColorButton(colors.magenta, ""),
            ColorButton(colors.purple, ""),
            ColorButton(colors.orange, "")
          )
        ),
      ];
    }

    function ThicknessButton(sw: any, propname: any) {
      // A context menu button for setting a data property with a stroke thickness value.
      if (!propname) propname = "thickness";
      return $(go.Shape, "LineH", {
        width: 16,
        height: 16,
        strokeWidth: sw,
        margin: 2,
        background: "transparent",
        mouseEnter: (e: any, shape: any) => (shape.background = "dodgerblue"),
        mouseLeave: (e: any, shape: any) => (shape.background = "transparent"),
        click: ClickFunction(propname, sw),
        contextClick: ClickFunction(propname, sw),
      });
    }

    function DashButton(dash: any, propname: any) {
      // A context menu button for setting a data property with a stroke dash Array value.
      if (!propname) propname = "dash";
      return $(go.Shape, "LineH", {
        width: 24,
        height: 16,
        strokeWidth: 2,
        strokeDashArray: dash,
        margin: 2,
        background: "transparent",
        mouseEnter: (e: any, shape: any) => (shape.background = "dodgerblue"),
        mouseLeave: (e: any, shape: any) => (shape.background = "transparent"),
        click: ClickFunction(propname, dash),
        contextClick: ClickFunction(propname, dash),
      });
    }

    function StrokeOptionsButtons() {
      // Function to create stroke options buttons for context menus
      return [
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ThicknessButton(1, ""),
            ThicknessButton(2, ""),
            ThicknessButton(3, ""),
            ThicknessButton(4, "")
          )
        ),
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            DashButton(null, ""),
            DashButton([2, 4], ""),
            DashButton([4, 4], "")
          )
        ),
      ];
    }

    function changeColor(diagram: any, color: any, propname: any) {
      // Function to change color of selected nodes/links
      diagram.startTransaction("change color");
      diagram.selection.each((selection: any) => {
        if (selection instanceof go.Node) {
          var data = selection.data;
          diagram.model.setDataProperty(data, propname, color);
        } else if (selection instanceof go.Link) {
          var data = selection.data;
          diagram.model.setDataProperty(data, propname, color);
        }
      });
      diagram.commitTransaction("change color");
    }

    function ColorPickerButton(propname: any) {
      // Function to create color picker buttons for context menus
      if (!propname) propname = "color";
      var selectedColor: any;
      return $(
        go.Shape,
        "RoundedRectangle",
        {
          name: "SHAPE_" + propname.toUpperCase(),
          width: 85,
          height: 20,
          margin: 4,
          click: (e: any, obj: any) => {
            var colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.addEventListener("change", function (event: any) {
              selectedColor = event.target.value;
              changeColor(diagram, selectedColor, propname);
            });

            colorInput.click();
          },
        },
        new go.Binding("fill", propname).makeTwoWay()
      );
    }

    diagram.nodeTemplate.contextMenu = $(
      // Node Context Menu
      "ContextMenu",
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("fill"))
      ),
      LightFillButtons(),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Vertical",
          $(go.Shape, "Rectangle", { width: 85, height: 0.3, margin: 2 })
        )
      ),
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("color"))
      ),
      DarkColorButtons(),
      StrokeOptionsButtons()
    );

    diagram.linkTemplate = $(
      // Link Template for All the Links
      go.Link,
      {
        routing: go.Routing.AvoidsNodes,
        selectable: true,
        curve: go.Curve.JumpGap,
        adjusting: go.LinkAdjusting.Stretch,
        reshapable: true,
        resizable: true,
        corner: 10,
        fromShortLength: 6,
        toShortLength: 8,
        fromPortId: "",
        toPortId: "",
        fromEndSegmentLength: 0,
        toEndSegmentLength: 0,
        layerName: "Foreground",
        zOrder: 1,
        visible: true,
        doubleClick: (e: any, link: any) => {
          e.diagram.model.commit((m: any) => {
            if (!link.data.text || /^\s*$/.test(link.data.text)) {
              m.set(link.data, "text", "Label");
            }
          });
        },
      },
      new go.Binding("curve", "curve").makeTwoWay(),
      new go.Binding("routing", "routing").makeTwoWay(),
      new go.Binding("fromSpot", "fromSpot", go.Spot.parse, go.Spot.stringify),
      new go.Binding("toSpot", "toSpot", go.Spot.parse, go.Spot.stringify),
      new go.Binding("fromShortLength", "dir", (dir) =>
        dir >= 1 ? (dir === 16 || dir === 17 ? 16 : 10) : 0
      ),
      new go.Binding("toShortLength", "dir", (dir) =>
        dir >= 1 ? (dir === 16 || dir === 17 ? 16 : 10) : 0
      ),
      new go.Binding(
        "fromEndSegmentLength",
        "fromEndSegmentLength"
      ).makeTwoWay(),
      new go.Binding("toEndSegmentLength", "toEndSegmentLength").makeTwoWay(),
      new go.Binding("fromPortId", "fromPort").makeTwoWay(),
      new go.Binding("toPortId", "toPort").makeTwoWay(),
      new go.Binding("points").makeTwoWay(),
      new go.Binding("relinkableFrom", "canRelink").ofModel(),
      new go.Binding("relinkableTo", "canRelink").ofModel(),
      $(
        go.Shape,
        { isPanelMain: true, stroke: "#595959", strokeWidth: 2 },
        new go.Binding("stroke", "color"),
        new go.Binding("strokeWidth", "thickness"),
        new go.Binding("strokeDashArray", "dash")
      ),
      $(
        go.Shape,
        { isPanelMain: true, stroke: "transparent", strokeWidth: 2 },
        new go.Binding("strokeWidth", "thickness")
      ),
      $(
        go.Shape,
        {
          toArrow: "Standard",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("visible", "dir", (dir) => dir == 1)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 2 ? "Backward" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 2)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 2 ? "Standard" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 2)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 3 ? "InverseLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 3)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 4 ? "Line" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 4)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 5 ? "BackwardFork" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 5)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 6 ? "Fork" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 6)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 7 ? "InverseDoubleLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 7)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 8 ? "DoubleLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 8)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 9 ? "InverseOptionalLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 9)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 10 ? "OptionalLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 10)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 11 ? "BackwardCircleFork" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 11)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 12 ? "CircleFork" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 12)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 1,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 13 ? "Triangle" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 13)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 1.5,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 14 ? "OpenTriangle" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 14)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 1.5,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 15 ? "BackwardOpenTriangle" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 15)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "white",
          scale: 2,
        },
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 16 ? "Block" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 16)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "white",
          scale: 2,
        },
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 17 ? "Block" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 17)
      ),
      {
        // Highlighting the link when selected
        mouseEnter: (e: any, link: any) => {
          link.elt(1).stroke = "rgba(215, 240, 230, 0.3)";
        },
        mouseLeave: (e: any, link: any) => {
          link.elt(1).stroke = "transparent";
        },
      },
      $(
        go.Panel,
        "Auto",
        { cursor: "move", margin: 6 },
        $(
          go.Shape, // the label background, for consistency purposes
          {
            fill: "transparent",
            stroke: null,
          }
        ),
        $(
          go.TextBlock,
          "", // the label text
          {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "white",
            margin: 4,
            editable: true, // editing the text automatically updates the model data
          },
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "color"),
          new go.Binding("font", "fontType"),
          new go.Binding("isUnderline", "setUnderline")
        ),
        new go.Binding(
          "segmentOffset",
          "segmentOffset",
          go.Point.parse
        ).makeTwoWay(go.Point.stringify)
      )
    );

    diagram.linkTemplate.selectionAdornmentTemplate = $(
      // Link Selection Adornment Template (custom)
      go.Adornment,
      $(
        go.Shape,
        {
          // this uses a pathPattern with a gap in it, in order to avoid drawing on top of the link path Shape
          isPanelMain: true,
          stroke: "transparent",
          strokeWidth: 2,
          pathPattern: makeAdornmentPathPattern(2), // == thickness or strokeWidth
        },
        new go.Binding("pathPattern", "thickness", makeAdornmentPathPattern)
      ),
      CMButton({ alignmentFocus: new go.Spot(0, 0, -6, -4) })
    );

    function makeAdornmentPathPattern(w: any) {
      // Function to create a path pattern for the link selection adornment
      return $(go.Shape, {
        stroke: "#2c4247",
        strokeWidth: 2,
        strokeCap: "round",
        geometryString: "M0 0 M0 3 H3 M0 " + (w + 4).toString() + " H3",
      });
    }

    function ArrowButton(num: any) {
      // Function to create arrow buttons for context menus
      var geo =
        "F1 m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 3 0 L 8 4 M 3 8 L 4 4 L 4 4 L 8 4 L 4 4 L 3 0 L 8 4 L 3 8";
      if (num === 0) {
        geo = "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4";
      } else if (num === 2) {
        geo =
          "F1 m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 3 0 L 8 4 M 3 8 L 4 4 L 4 4 L 8 4 L 4 4 L 3 0 L 8 4 L 3 8 M -11 0 L -16 4 L -11 8 L -12 4 M -12 4 L -11 0";
      } else if (num === 3) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M -13 0 L -13 8";
      } else if (num === 4) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 5 0 L 5 8";
      } else if (num === 5) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 M -16 0 L -8 4 M -16 4 L -8 4 M -16 8 L -8 4";
      } else if (num === 6) {
        geo =
          "m 0 4 l 8 0 m -8 0 l 8 -4 m -8 4 l 8 4 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4";
      } else if (num === 7) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M -11 0 L -11 8 M -13 0 L -13 8";
      } else if (num === 8) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 3 0 L 3 8 M 5 0 L 5 8";
      } else if (num === 9) {
        geo =
          "F1 m -0 -4 l -8 0 m 8 -0 M 8 -4 L -0 -4 L 8 -4 M 16 -4 L 8 -4 L 8 -4 M -5 0 L -5 -8 M -3 -4 A 1 1 180 0 0 2 -4 A 1 1 180 0 0 -3 -4";
      } else if (num === 10) {
        geo =
          "F1 m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 5 0 L 5 8 M 3 4 A 1 1 0 0 0 -2 4 A 1 1 0 0 0 3 4";
      } else if (num === 11) {
        geo =
          "F1 m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 M -16 0 L -8 4 M -16 4 L -8 4 M -16 8 L -8 4 A 1 1 0 0 0 -3 4 A 1 1 0 0 0 -8 4";
      } else if (num === 12) {
        geo =
          "F1 m 0 4 l 8 0 m -8 0 l 8 -4 m -8 4 l 8 4 M -8 4 L 0 4 A 1 1 0 0 0 -5 4 A 1 1 0 0 0 0 4 L -8 4 M -16 4 L -8 4 L -8 4";
      } else if (num === 13) {
        geo =
          "F1 m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 3 0 L 8 4 M 3 8 L 3 4 L 3 4 L 8 4 L 3 4 L 3 0 L 8 4 L 3 8";
      } else if (num === 14) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 3 0 L 8 4 M 3 8 L 8 4 L 3 4 L 8 4 L 3 8";
      } else if (num === 15) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 L 8 4 L 8 4 M -11 0 L -16 4 L -11 8 M -12 4";
      } else if (num === 16) {
        geo =
          "m 0 4 l 3 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 3 1 L 3 7 L 8 7 L 8 1 L 3 1";
      } else if (num === 17) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -11 4 L -8 4 L -8 4 M -11 1 L -11 7 L -16 7 L -16 1 L -11 1";
      }
      return $(go.Shape, {
        geometryString: geo,
        margin: 4,
        background: "transparent",
        mouseEnter: (e: any, shape: any) => (shape.stroke = "dodgerblue"),
        mouseLeave: (e: any, shape: any) => (shape.stroke = "black"),
        click: ClickFunction("dir", num),
        contextClick: ClickFunction("dir", num),
      });
    }

    diagram.linkTemplate.contextMenu = $(
      // Link Context Menu
      "ContextMenu",
      DarkColorButtons(),
      StrokeOptionsButtons(),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ArrowButton(0),
          ArrowButton(1),
          ArrowButton(2),
          ArrowButton(3)
        )
      ),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ArrowButton(4),
          ArrowButton(5),
          ArrowButton(6),
          ArrowButton(7)
        )
      ),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ArrowButton(8),
          ArrowButton(9),
          ArrowButton(10),
          ArrowButton(11)
        )
      ),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ArrowButton(12),
          ArrowButton(13),
          ArrowButton(14),
          ArrowButton(15)
        )
      ),
      $(
        "ContextMenuButton",
        $(go.Panel, "Horizontal", ArrowButton(16), ArrowButton(17))
      ),
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("color"))
      )
    );

    diagram.groupTemplate = $(
      // Group Template
      go.Group,
      "Vertical",
      {
        selectionObjectName: "PANEL",
        ungroupable: true, // enables Ctrl-Shift-G to ungroup a selected Group
      },
      $(
        go.TextBlock,
        {
          stroke: "dodgerblue",
          font: "bold 19px sans-serif",
          margin: 4,
          isMultiline: false, // don't allow newlines in text
          editable: true, // allow in-place editing by user
        },
        new go.Binding("text", "text").makeTwoWay(),
        new go.Binding("stroke", "color")
      ),
      $(
        go.Panel,
        "Auto",
        { name: "PANEL" },
        $(
          go.Shape,
          "Rectangle", // the rectangular shape around the members
          {
            fill: "rgba(128,128,128,0.2)",
            stroke: "gray",
            strokeWidth: 3,
            cursor: "pointer",
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true,
          },
          new go.Binding("fill"),
          new go.Binding("stroke", "color"),
          new go.Binding("strokeWidth", "thickness"),
          new go.Binding("strokeDashArray", "dash")
        ),
        $(go.Placeholder, { margin: 10, background: "transparent" }), // represents where the members are
        makePort("T", go.Spot.Top, true, true),
        makePort("TLM", new go.Spot(0.2, 0, 0, 0), true, true),
        makePort("TRM", new go.Spot(0.8, 0, 0, 0), true, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("BLM", new go.Spot(0.2, 1, 0, 0), true, true),
        makePort("BRM", new go.Spot(0.8, 1, 0, 0), true, true),
        makePort("B", go.Spot.Bottom, true, true)
      ),

      {
        // handles mouse enter/leave events to show/hide the ports
        mouseEnter: (e, group: any) => {
          showGroupPorts(group, true);
        },
        mouseLeave: (e, group: any) => {
          showGroupPorts(group, false);
        },
      }
    );

    diagram.groupTemplate.selectionAdornmentTemplate = $(
      // Group Selection Adornment Template
      go.Adornment,
      "Spot",
      $(
        go.Panel,
        "Auto",
        $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
        $(go.Placeholder, { margin: 1.5 })
      ),
      CMButton({
        alignment: go.Spot.TopRight,
        alignmentFocus: go.Spot.BottomRight,
      })
    );

    diagram.groupTemplate.contextMenu = $(
      // Group Context Menu
      "ContextMenu",
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("fill"))
      ),
      LightFillButtons(),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Vertical",
          $(go.Shape, "Rectangle", { width: 85, height: 0.3, margin: 2 })
        )
      ),
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("color"))
      ),
      DarkColorButtons(),
      StrokeOptionsButtons()
    );

    return diagram;
  };

  const initPalette = () => {
    // Function to initialize the palette
    const $ = go.GraphObject.make;
    const palette = $(go.Palette, {
      padding: new go.Margin(68, 0, 0, 0),
      maxSelectionCount: 1,
      linkTemplate: $(
        go.Link,
        {
          maxSize: new go.Size(48, 48),
        },
        {
          routing: go.Routing.Normal,
          corner: 5,
          toShortLength: 4,
        },
        new go.Binding("points"),
        new go.Binding("routing", "routing"),
        $(
          go.Shape,
          { isPanelMain: true, stroke: "white", strokeWidth: 2 },

          new go.Binding("strokeDashArray", "dash")
        ),
        $(
          go.Shape,
          {
            toArrow: "Standard",
            stroke: "white",
            fill: "white",
          },
          new go.Binding("visible", "dir", (dir) => dir == 1)
        )
      ),
      model: $(go.GraphLinksModel, {
        // The Palette's model is a GraphLinksModel that contains an array of node data objects representing the palette's contents
        linkKeyProperty: "key",
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          data.key = k;
          return k;
        },
      }),
    });

    palette.nodeTemplate = $(
      // Node Template for the Palette
      go.Node,
      "Vertical",
      $(
        go.Shape,
        {
          strokeWidth: 1.6,
          stroke: "white",
          maxSize: new go.Size(48, 48),
          fill: "#262626",
          cursor: "pointer",
        },
        new go.Binding("figure", "shape", (shape) => {
          // Mapping the shape property to the corresponding figure property for the all shapes
          switch (shape) {
            case "Start":
              return "Ellipse";
            case "Process":
              return "Rectangle";
            case "Decision":
              return "Diamond";
            case "Input":
              return "Input";
            case "Initial State":
              return "Circle";
            case "State Box":
              return "RoundedRectangle";
            case "EndState":
              return "EndState";
            case "Guard":
              return "Diamond";
            case "Actor":
              return "Actor";
            case "Object":
              return "Rectangle";
            case "Time Event":
              return "Collate";
            case "Flow Final":
              return "Junction";
            case "Fork":
              return "Fork";
            case "File":
              return "File";
            case "Strong Entity":
              return "Rectangle";
            case "Weak Entity":
              return "WeakEntity";
            case "Associative Entity":
              return "AssociativeEntity";
            case "Weak Relationship":
              return "WeakRelationship";
            case "Multivalued":
              return "Multivalued";
            case "Execution":
              return "Execution";
            case "Frag":
              return "FragP";
            case "Destruction Event":
              return "IrritationHazard";
            case "Component":
              return "CompP";
            case "ComponentBox":
              return "CompP2";
            case "Operator":
              return "Operator";
            case "Cube":
              return "CubeBox";
            case "CompDep":
              return "CompDepP";
            // Add more shape mappings as needed
            default:
              return "RoundedRectangle"; // Default to RoundedRectangle if shape is not recognized
          }
        })
      )
    );

    palette.nodeTemplate.selectionAdornmentTemplate = $(
      // Node Selection Adornment Template (highlights when selected)
      go.Adornment,
      "Spot",
      $(
        go.Panel,
        "Auto",
        $(go.Shape, { fill: null, stroke: "transparent", strokeWidth: 3 }),
        $(go.Placeholder, { margin: 1.5 })
      )
    );

    return palette;
  };

  const cloudJSON = () => {
    // Function to get the JSON data of the diagram and store it to the cloud
    const diagram = diagramRef.current?.getDiagram();
    const jsonData = diagram?.model.toJson();
    return jsonData;
  };

  const saveJSON = () => {
    // Function to save the JSON data of the diagram as a file
    const diagram = diagramRef.current?.getDiagram();
    const jsonData = diagram?.model.toJson();
    const filename = diagramName || "mistleDiagram";

    if (jsonData) {
      const blob = new Blob([jsonData], { type: "application/json" });

      saveAs(blob, `${filename}.json`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Function to handle the file change event (loading files from system storage)
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        importJSON(fileContent);
      };
      reader.readAsText(file);
    }
  };

  const importJSON = (jsonString: string) => {
    // Function to import JSON data to the diagram
    const diagram = diagramRef.current?.getDiagram();
    if (diagram) {
      diagram.model = go.Model.fromJson(jsonString);
    }
  };

  // To save the diagram as a PNG file

  function myPNGCallback(blob: any) {
    var url = window.URL.createObjectURL(blob);
    var filename = diagramName || "mistleDiagram";

    var a = document.createElement("a");
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = `${filename}.png`;

    if ((window.navigator as any).msSaveBlob !== undefined) {
      // In case someone is still using IE 11
      (window.navigator as any).msSaveBlob(blob, `${filename}.png`);
      return;
    }

    document.body.appendChild(a);
    requestAnimationFrame(() => {
      // To prevent the download from being blocked by the browser
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  function makePNGBlob() {
    // Function to create a PNG blob of the diagram
    const diagram = diagramRef.current?.getDiagram();
    var blob = diagram?.makeImageData({
      background: backgroundColor,
      scale: 2,
      maxSize: new go.Size(Infinity, Infinity),
      returnType: "blob",
      callback: myPNGCallback,
    });
  }

  // To save the diagram as a SVG file

  function mySVGCallback(blob: any) {
    var url = window.URL.createObjectURL(blob);
    var filename = diagramName || "mistleDiagram";

    var a = document.createElement("a");
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = `${filename}.svg`;

    // In case someone is still using IE 11
    if ((window.navigator as any).msSaveBlob !== undefined) {
      (window.navigator as any).msSaveBlob(blob, `${filename}.svg`);
      return;
    }

    document.body.appendChild(a);
    requestAnimationFrame(() => {
      // To prevent the download from being blocked by the browser
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  function makeSVGBlob() {
    // Function to create a SVG blob of the diagram
    const diagram = diagramRef.current?.getDiagram();
    var svg = diagram?.makeSvg({ scale: 1, background: backgroundColor });
    if (svg) {
      var svgstr = new XMLSerializer().serializeToString(svg);
      var blob = new Blob([svgstr], { type: "image/svg+xml" });
      mySVGCallback(blob);
    }
  }

  function handleSave(filetype: string) {
    // Function to handle the save event
    if (filetype === "JSON") {
      saveJSON();
    } else if (filetype === "SVG") {
      makeSVGBlob();
    } else if (filetype === "PNG") {
      makePNGBlob();
    } else {
      console.error("Invalid file type");
    }
  }

  function changeGridStroke(diagram: any, color: any) {
    // Function to change the grid stroke color
    diagram.startTransaction("change grid stroke");
    diagram.grid.findObject("GRID").elements.each((shape: any) => {
      if (shape instanceof go.Shape) {
        shape.stroke = color;
      }
    });
    diagram.commitTransaction("change grid stroke");
  }

  const zoomToFit = () => {
    // Function to zoom the diagram to fit the viewport
    const diagram: any = diagramRef.current?.getDiagram();
    diagram.commandHandler.zoomToFit();
  };

  function changeText(diagram: any, color: any, propname: any) {
    // Function to change the text of the selected nodes/links
    diagram.startTransaction("change text");
    diagram.selection.each((selection: any) => {
      if (selection instanceof go.Node) {
        var data = selection.data;
        diagram.model.setDataProperty(data, propname, color);
      } else if (selection instanceof go.Link) {
        var data = selection.data;
        diagram.model.setDataProperty(data, propname, color);
      }
    });
    diagram.commitTransaction("change text");
  }

  function addNote() {
    // Function to add a note to the diagram
    const diagram: any = diagramRef.current?.getDiagram();

    diagram.startTransaction("add note");

    // creating a new node data object
    const newNodeData = {
      text: "Note",
      fill: "lightgreen",
      shape: "File",
      loc: "-455 -105",
    };
    // adding the new node data to the model
    diagram.model.addNodeData(newNodeData);

    diagram.commitTransaction("add note");
  }

  return (
    <>
      <ReactDiagram // Diagram Component
        ref={diagramRef}
        divClassName="diagram-component"
        style={diagramStyle}
        initDiagram={initDiagram}
        nodeDataArray={props.nodeDataArray}
        linkDataArray={props.linkDataArray}
        modelData={props.modelData}
        onModelChange={props.onModelChange}
        skipsDiagramUpdate={props.skipsDiagramUpdate}
      />

      {(!loading || cloudLoading) && (
        <div className="flex relative z-50 bg-transparent justify-center items-center min-h-screen">
          <img
            src="/logo.svg"
            alt="loading"
            className="w-24 h-24 animate-bounce"
          />
        </div>
      )}
      <div
        className={`${
          pallete
            ? "opacity-100 left-[66px] z-50"
            : "opacity-0 left-[46px] -z-10"
        } fixed top-[17%] flex flex-col justify-between items-center gap-5 py-5 w-56 rounded-3xl border-2 border-purple-400 bg-neutral-800  transition-all duration-300 ease-in-out`}
      >
        <ReactPalette // Palette Component
          initPalette={initPalette}
          divClassName="palette-component"
          nodeDataArray={nodeDataArray || []}
          linkDataArray={linkDataArray}
        />
        <select // Dropdown for selecting the diagram type
          value={selectedOption}
          onChange={handleOptionChange}
          className="w-40 p-1.5 text-black rounded outline-none bg-white "
        >
          <option value="option1">Flowchart</option>
          <option value="option2">State/Activity Diagram</option>
          <option value="option3">Block Diagram</option>
          <option value="option4">Collaboration/UseCase Diagram</option>
          <option value="option5">Entity Relationship Diagram</option>
          <option value="option6">Sequence Diagram</option>
          <option value="option7">Component/Deployment Diagram</option>
        </select>
        <div className="absolute text-purple-400 text-xl font-medium z-50 h-[68px] w-48 bg-neutral-800 flex items-start py-2 justify-center">
          Shapes
          <div className="absolute w-full h-[1.5px] bg-white bottom-4"></div>
        </div>
      </div>
      <TextStyles // TextStyles Component
        textStyles={textStyles}
        changeText={changeText}
        diagramRef={diagramRef}
      />
      <Topleftbar // Topleftbar Component with Namebar, Save and File Upload
        loading={loading}
        diagramName={diagramName}
        handleNameChange={handleNameChange}
        handleKeyPress={handleKeyPress}
        handleFileChange={handleFileChange}
        handleSave={handleSave}
        setDiagramName={setDiagramName}
        format={format}
        setFormat={setFormat}
        cloudJSON={cloudJSON}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
      />
      <div
        className={`${loading ? "show" : "load"}
      fixed z-10 top-6 right-4`}
      >
        <HeaderAvatar showText={false} openLink="_self" />
      </div>
      <Leftbar // Leftbar Tools Component
        loading={loading}
        pallete={pallete}
        setPallete={setPallete}
        togglePalette={togglePalette}
        textStyles={textStyles}
        setTextStyles={setTextStyles}
        toggleTextStyles={toggleTextStyles}
        linkType={linkType}
        setLinkType={setLinkType}
        diagramRef={diagramRef}
        addNote={addNote}
      />
      <Settings //Bottom Right Settings Component
        loading={loading}
        theme={theme}
        guide={guide}
        grid={grid}
        fscreen={fscreen}
        zoomToFit={zoomToFit}
        toggleGuidedDraggingTool={toggleGuidedDraggingTool}
        handleToggleGuides={handleToggleGuides}
        toggleGrid={toggleGrid}
        toggleFullScreen={toggleFullScreen}
        handleThemeChanges={handleThemeChanges}
      />
    </>
  );
};

export default DiagramWrapper;
