import * as go from "gojs";

export class LinkShiftingTool extends go.Tool {
  // these are archetypes for the two shift handles, one at each end of the Link:
  private _fromHandleArchetype: go.GraphObject | null;
  private _toHandleArchetype: go.GraphObject | null;

  // transient state
  private _handle: go.GraphObject | null;
  private _originalPoints: go.List<go.Point> | null;

  /**
   * Constructs a LinkShiftingTool and sets the handles and name of the tool.
   */
  constructor(init?: Partial<LinkShiftingTool>) {
    super();
    this.name = "LinkShifting";
    const h: go.Shape = new go.Shape();
    h.geometryString = "F1 M0 0 L8 0 M8 4 L0 4";
    h.fill = null;
    h.stroke = "dodgerblue";
    h.background = "lightblue";
    h.cursor = "pointer";
    //  h.alignmentFocus = go.Spot.Left;
    // h.segmentOffset = new go.Point(10, 0);
    h.segmentIndex = 1;
    h.segmentFraction = 0.05;
    h.segmentOrientation = go.Orientation.Along;
    const g: go.Shape = new go.Shape();
    g.geometryString = "F1 M0 0 L8 0 M8 4 L0 4";
    g.fill = null;
    g.stroke = "dodgerblue";
    g.background = "lightblue";
    g.cursor = "pointer";
    //   g.alignmentFocus = go.Spot.Right;
    // g.segmentOffset = new go.Point(-10, 0);
    g.segmentIndex = -2;
    g.segmentFraction = 0.05;
    g.segmentOrientation = go.Orientation.Along;
    this._fromHandleArchetype = h;
    this._toHandleArchetype = g;
    this._originalPoints = null;
    this._handle = null;
    this._originalPoints = null;
    if (init) Object.assign(this, init);
  }

  /**
   * A small GraphObject used as a shifting handle.
   */
  get fromHandleArchetype(): go.GraphObject | null {
    return this._fromHandleArchetype;
  }
  set fromHandleArchetype(value: go.GraphObject | null) {
    this._fromHandleArchetype = value;
  }

  /**
   * A small GraphObject used as a shifting handle.
   */
  get toHandleArchetype(): go.GraphObject | null {
    return this._toHandleArchetype;
  }
  set toHandleArchetype(value: go.GraphObject | null) {
    this._toHandleArchetype = value;
  }

  /**
   * Show an {@link go.Adornment} with a reshape handle at each end of the link which allows for shifting of the end points.
   */
  override updateAdornments(part: go.Part): void {
    if (part === null || !(part instanceof go.Link)) return; // this tool only applies to Links
    const link: go.Link = part;
    // show handles if link is selected, remove them if no longer selected
    let category = "LinkShiftingFrom";
    let adornment = null;
    if (link.isSelected && !this.diagram.isReadOnly && link.fromPort) {
      const selelt = link.selectionObject;
      if (
        selelt !== null &&
        link.actualBounds.isReal() &&
        link.isVisible() &&
        selelt.actualBounds.isReal() &&
        selelt.isVisibleObject()
      ) {
        const spot = (link as any).computeSpot(true);
        if (spot.isSide() || spot.isSpot()) {
          adornment = link.findAdornment(category);
          if (adornment === null) {
            adornment = this.makeAdornment(selelt, false);
            adornment.category = category;
            link.addAdornment(category, adornment);
          } else {
            // This is just to invalidate the measure, so it recomputes itself based on the adorned link
            adornment.segmentFraction = Math.random();
          }
        }
      }
    }
    if (adornment === null) link.removeAdornment(category);

    category = "LinkShiftingTo";
    adornment = null;
    if (link.isSelected && !this.diagram.isReadOnly && link.toPort) {
      const selelt = link.selectionObject;
      if (
        selelt !== null &&
        link.actualBounds.isReal() &&
        link.isVisible() &&
        selelt.actualBounds.isReal() &&
        selelt.isVisibleObject()
      ) {
        const spot = (link as any).computeSpot(false);
        if (spot.isSide() || spot.isSpot()) {
          adornment = link.findAdornment(category);
          if (adornment === null) {
            adornment = this.makeAdornment(selelt, true);
            adornment.category = category;
            link.addAdornment(category, adornment);
          } else {
            // This is just to invalidate the measure, so it recomputes itself based on the adorned link
            adornment.segmentFraction = Math.random();
          }
        }
      }
    }
    if (adornment === null) link.removeAdornment(category);
  }

  /**
   * @hidden @internal
   * @param selelt - the {@link go.GraphObject} of the {@link go.Link} being shifted.
   * @param toend
   */
  makeAdornment(selelt: go.GraphObject, toend: boolean): go.Adornment {
    const adornment = new go.Adornment();
    adornment.type = go.Panel.Link;
    const h = toend ? this.toHandleArchetype : this.fromHandleArchetype;
    if (h !== null) {
      // add a single handle for shifting at one end
      adornment.add(h.copy());
    }
    adornment.adornedObject = selelt;
    return adornment;
  }

  /**
   * This tool may run when there is a mouse-down event on a reshaping handle.
   */
  override canStart(): boolean {
    if (!this.isEnabled) return false;
    const diagram = this.diagram;
    if (diagram.isReadOnly || diagram.isModelReadOnly) return false;
    if (!diagram.lastInput.left) return false;
    let h = this.findToolHandleAt(
      diagram.firstInput.documentPoint,
      "LinkShiftingFrom"
    );
    if (h === null)
      h = this.findToolHandleAt(
        diagram.firstInput.documentPoint,
        "LinkShiftingTo"
      );
    return h !== null;
  }

  /**
   * Start shifting, if {@link findToolHandleAt} finds a reshaping handle at the mouse down point.
   *
   * If successful this sets the handle to be the reshape handle that it finds.
   * It also remembers the original points in case this tool is cancelled.
   * And it starts a transaction.
   */
  override doActivate(): void {
    const diagram = this.diagram;
    let h = this.findToolHandleAt(
      diagram.firstInput.documentPoint,
      "LinkShiftingFrom"
    );
    if (h === null)
      h = this.findToolHandleAt(
        diagram.firstInput.documentPoint,
        "LinkShiftingTo"
      );
    if (h === null) return;
    const ad = h.part as go.Adornment;
    if (ad === null || ad.adornedObject === null) return;
    const link = ad.adornedObject.part;
    if (!(link instanceof go.Link)) return;

    this._handle = h;
    this._originalPoints = link.points.copy();
    this.startTransaction(this.name);
    diagram.isMouseCaptured = true;
    diagram.currentCursor = "pointer";
    this.isActive = true;
  }

  /**
   * This stops the current shifting operation with the link as it is.
   */
  override doDeactivate(): void {
    this.isActive = false;
    const diagram = this.diagram;
    diagram.isMouseCaptured = false;
    diagram.currentCursor = "";
    this.stopTransaction();
  }

  /**
   * Perform cleanup of tool state.
   */
  override doStop(): void {
    this._handle = null;
    this._originalPoints = null;
  }

  /**
   * Restore the link route to be the original points and stop this tool.
   */
  override doCancel(): void {
    if (this._handle !== null) {
      const ad = this._handle.part as go.Adornment;
      if (ad.adornedObject === null) return;
      const link = ad.adornedObject.part as go.Link;
      if (this._originalPoints !== null) link.points = this._originalPoints;
    }
    this.stopTool();
  }

  /**
   * Call {@link doReshape} with a new point determined by the mouse
   * to change the end point of the link.
   */
  override doMouseMove(): void {
    if (this.isActive) {
      this.doReshape(this.diagram.lastInput.documentPoint);
    }
  }

  /**
   * Reshape the link's end with a point based on the most recent mouse point by calling {@link doReshape},
   * and then stop this tool.
   */
  override doMouseUp(): void {
    if (this.isActive) {
      this.doReshape(this.diagram.lastInput.documentPoint);
      this.transactionResult = this.name;
    }
    this.stopTool();
  }

  /**
   * Find the closest point along the edge of the link's port and shift the end of the link to that point.
   */
  doReshape(pt: go.Point): void {
    if (this._handle === null) return;
    const ad = this._handle.part as go.Adornment;
    if (ad.adornedObject === null) return;
    const link = ad.adornedObject.part as go.Link;
    const fromend = ad.category === "LinkShiftingFrom";
    let port = null;
    if (fromend) {
      port = link.fromPort;
    } else {
      port = link.toPort;
    }
    if (port === null) return;
    // support rotated ports
    const portang = port.getDocumentAngle();
    const center = port.getDocumentPoint(go.Spot.Center);
    const farpt = pt
      .copy()
      .offset((pt.x - center.x) * 1000, (pt.y - center.y) * 1000);
    const portb = new go.Rect(
      port
        .getDocumentPoint(go.Spot.TopLeft)
        .subtract(center)
        .rotate(-portang)
        .add(center),
      port
        .getDocumentPoint(go.Spot.BottomRight)
        .subtract(center)
        .rotate(-portang)
        .add(center)
    );
    let lp = link.getLinkPointFromPoint(
      port.part as go.Node,
      port,
      center,
      farpt,
      fromend
    );
    lp = lp.copy().subtract(center).rotate(-portang).add(center);
    const spot = new go.Spot(
      Math.max(0, Math.min(1, (lp.x - portb.x) / (portb.width || 1))),
      Math.max(0, Math.min(1, (lp.y - portb.y) / (portb.height || 1)))
    );
    if (fromend) {
      link.fromSpot = spot;
    } else {
      link.toSpot = spot;
    }
  }
}

export default LinkShiftingTool;
