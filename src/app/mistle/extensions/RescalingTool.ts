"use strict";
import * as go from "gojs";

class RescalingTool extends go.Tool {
  private _rescaleObjectName: string = "";
  private _handleArchetype: go.Shape = new go.Shape();
  private _adornedObject: go.GraphObject | null = null;
  private _handle: go.GraphObject | null = null;
  private originalPoint: go.Point = new go.Point();
  private originalTopLeft: go.Point = new go.Point();
  private originalScale: number = 1.0;

  constructor() {
    super();
    this.name = "Rescaling";

    this._handleArchetype.desiredSize = new go.Size(8, 8);
    this._handleArchetype.fill = "lightblue";
    this._handleArchetype.stroke = "dodgerblue";
    this._handleArchetype.strokeWidth = 1;
    this._handleArchetype.cursor = "nwse-resize";
    this.diagram.addDiagramListener(
      "ChangedSelection",
      this.handleSelectionChanged.bind(this)
    );
    this.diagram.addDiagramListener(
      "SelectionGrouped",
      this.handleSelectionGrouped.bind(this)
    );
    this.diagram.addDiagramListener(
      "SelectionUngrouped",
      this.handleSelectionUngrouped.bind(this)
    );
  }

  handleSelectionChanged() {
    var selectedNode = this.diagram.selection.first();
    if (selectedNode instanceof go.Group) {
      // Set fill and cursor to null for the rescaling tool
      this._handleArchetype.fill = null;
      this._handleArchetype.cursor = "null";
      this._handleArchetype.stroke = null;
    } else {
      // Reset fill and cursor to their original values
      this._handleArchetype.fill = "lightblue";
      this._handleArchetype.cursor = "nwse-resize";
      this._handleArchetype.stroke = "dodgerblue";
    }
  }

  handleSelectionGrouped() {
    // Set fill and cursor to null for the rescaling tool
    this._handleArchetype.fill = null;
    this._handleArchetype.cursor = "null";
    this._handleArchetype.stroke = null;
  }

  handleSelectionUngrouped() {
    // Set fill and cursor to null for the rescaling tool
    this._handleArchetype.fill = "lightblue";
    this._handleArchetype.cursor = "nwse-resize";
    this._handleArchetype.stroke = "dodgerblue";
  }

  get adornedObject(): go.GraphObject | null {
    return this._adornedObject;
  }

  set adornedObject(val: go.GraphObject | null) {
    this._adornedObject = val;
  }

  get handleArchetype(): go.Shape {
    return this._handleArchetype;
  }

  set handleArchetype(val: go.Shape) {
    this._handleArchetype = val;
  }

  get handle(): go.GraphObject | null {
    return this._handle;
  }

  set handle(val: go.GraphObject | null) {
    this._handle = val;
  }

  get rescaleObjectName(): string {
    return this._rescaleObjectName;
  }

  set rescaleObjectName(val: string) {
    this._rescaleObjectName = val;
  }

  updateAdornments(part: go.Part): void {
    if (part === null || part instanceof go.Link) return;
    if (part.isSelected && !this.diagram.isReadOnly) {
      const rescaleObj = this.findRescaleObject(part);
      if (
        rescaleObj !== null &&
        part.actualBounds.isReal() &&
        part.isVisible() &&
        rescaleObj.actualBounds.isReal() &&
        rescaleObj.isVisibleObject()
      ) {
        let adornment = part.findAdornment(this.name);
        if (adornment === null || adornment.adornedObject !== rescaleObj) {
          adornment = this.makeAdornment(rescaleObj);
        }
        if (adornment !== null) {
          adornment.location = rescaleObj.getDocumentPoint(go.Spot.BottomRight);
          part.addAdornment(this.name, adornment);
          return;
        }
      }
    }
    part.removeAdornment(this.name);
  }

  makeAdornment(rescaleObj: go.GraphObject): go.Adornment {
    const adornment = new go.Adornment();
    adornment.type = go.Panel.Position;
    adornment.locationSpot = go.Spot.Center;
    adornment.add(this._handleArchetype.copy());
    adornment.adornedObject = rescaleObj;
    return adornment;
  }

  findRescaleObject(part: go.Part): go.GraphObject {
    const obj = part.findObject(this.rescaleObjectName);
    if (obj) return obj;
    return part;
  }

  canStart(): boolean {
    const diagram = this.diagram;
    if (diagram === null || diagram.isReadOnly) return false;
    if (!diagram.lastInput.left) return false;
    const h = this.findToolHandleAt(
      diagram.firstInput.documentPoint,
      this.name
    );
    return h !== null;
  }

  doActivate(): void {
    const diagram = this.diagram;
    if (diagram === null) return;
    this._handle = this.findToolHandleAt(
      diagram.firstInput.documentPoint,
      this.name
    );
    if (this._handle === null) return;

    this._adornedObject =
      (this._handle?.part as go.Adornment)?.adornedObject ?? null;
    if (!this._adornedObject) return;

    this.originalPoint = this._handle.getDocumentPoint(go.Spot.Center);
    if (!this.originalPoint) return;

    this.originalTopLeft = this._adornedObject.getDocumentPoint(
      go.Spot.TopLeft
    );
    if (!this.originalTopLeft) return;

    this.originalScale = this._adornedObject.scale;
    if (this.originalScale === null || this.originalScale === undefined) return;

    diagram.isMouseCaptured = true;
    diagram.delaysLayout = true;
    this.startTransaction(this.name);
    this.isActive = true;
  }

  doDeactivate(): void {
    const diagram = this.diagram;
    if (diagram === null) return;
    this.stopTransaction();
    this._handle = null;
    this._adornedObject = null;
    diagram.isMouseCaptured = false;
    this.isActive = false;
  }

  doCancel(): void {
    const diagram = this.diagram;
    if (diagram !== null) diagram.delaysLayout = false;
    this.scale(this.originalScale);
    this.stopTool();
  }

  doMouseMove(): void {
    const diagram = this.diagram;
    if (this.isActive && diagram !== null) {
      const newScale = this.computeScale(diagram.lastInput.documentPoint);
      this.scale(newScale);
    }
  }

  doMouseUp(): void {
    const diagram = this.diagram;
    if (this.isActive && diagram !== null) {
      diagram.delaysLayout = false;
      const newScale = this.computeScale(diagram.lastInput.documentPoint);
      this.scale(newScale);
      this.transactionResult = this.name;
    }
    this.stopTool();
  }

  scale(newScale: number): void {
    if (this._adornedObject !== null) {
      this._adornedObject.scale = newScale;
    }
  }

  computeScale(newPoint: go.Point): number {
    const scale = this.originalScale;
    const origdist = Math.sqrt(
      this.originalPoint.distanceSquaredPoint(this.originalTopLeft)
    );
    const newdist = Math.sqrt(
      newPoint.distanceSquaredPoint(this.originalTopLeft)
    );
    return scale * (newdist / origdist);
  }
}

export default RescalingTool;
