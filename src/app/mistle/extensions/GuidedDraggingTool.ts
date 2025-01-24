import * as go from "gojs";

export class GuidedDraggingTool extends go.DraggingTool {
  // horizontal guidelines
  public guidelineHtop: go.Part;
  public guidelineHbottom: go.Part;
  public guidelineHcenter: go.Part;
  // vertical guidelines
  public guidelineVleft: go.Part;
  public guidelineVright: go.Part;
  public guidelineVcenter: go.Part;

  // properties that the programmer can modify
  private _guidelineSnapDistance: number = 6;
  private _isGuidelineEnabled: boolean = true;
  private _horizontalGuidelineColor: string = "gray";
  private _verticalGuidelineColor: string = "gray";
  private _centerGuidelineColor: string = "gray";
  private _guidelineWidth: number = 1;
  private _searchDistance: number = 1000;
  private _isGuidelineSnapEnabled: boolean = true;

  /**
   * Constructs a GuidedDraggingTool and sets up the temporary guideline parts.
   */
  constructor() {
    super();

    const partProperties = { layerName: "Tool", isInDocumentBounds: false };
    const shapeProperties = { stroke: "gray", isGeometryPositioned: true };

    const $ = go.GraphObject.make;
    // temporary parts for horizonal guidelines
    this.guidelineHtop = $(
      go.Part,
      partProperties,
      $(go.Shape, shapeProperties, { geometryString: "M0 0 100 0" })
    );
    this.guidelineHbottom = $(
      go.Part,
      partProperties,
      $(go.Shape, shapeProperties, { geometryString: "M0 0 100 0" })
    );
    this.guidelineHcenter = $(
      go.Part,
      partProperties,
      $(go.Shape, shapeProperties, { geometryString: "M0 0 100 0" })
    );
    // temporary parts for vertical guidelines
    this.guidelineVleft = $(
      go.Part,
      partProperties,
      $(go.Shape, shapeProperties, { geometryString: "M0 0 0 100" })
    );
    this.guidelineVright = $(
      go.Part,
      partProperties,
      $(go.Shape, shapeProperties, { geometryString: "M0 0 0 100" })
    );
    this.guidelineVcenter = $(
      go.Part,
      partProperties,
      $(go.Shape, shapeProperties, { geometryString: "M0 0 0 100" })
    );
  }

  get guidelineSnapDistance(): number {
    return this._guidelineSnapDistance;
  }
  set guidelineSnapDistance(val: number) {
    if (typeof val !== "number" || isNaN(val) || val < 0)
      throw new Error(
        "new value for GuidedDraggingTool.guidelineSnapDistance must be a non-negative number"
      );
    this._guidelineSnapDistance = val;
  }

  get isGuidelineEnabled(): boolean {
    return this._isGuidelineEnabled;
  }
  set isGuidelineEnabled(val: boolean) {
    if (typeof val !== "boolean")
      throw new Error(
        "new value for GuidedDraggingTool.isGuidelineEnabled must be a boolean value."
      );
    this._isGuidelineEnabled = val;
  }

  get horizontalGuidelineColor(): string {
    return this._horizontalGuidelineColor;
  }
  set horizontalGuidelineColor(val: string) {
    if (this._horizontalGuidelineColor !== val) {
      this._horizontalGuidelineColor = val;
      if (this.guidelineHbottom)
        (this.guidelineHbottom.elements.first() as go.Shape).stroke =
          this._horizontalGuidelineColor;
      if (this.guidelineHtop)
        (this.guidelineHtop.elements.first() as go.Shape).stroke =
          this._horizontalGuidelineColor;
    }
  }

  get verticalGuidelineColor(): string {
    return this._verticalGuidelineColor;
  }
  set verticalGuidelineColor(val: string) {
    if (this._verticalGuidelineColor !== val) {
      this._verticalGuidelineColor = val;
      if (this.guidelineVleft)
        (this.guidelineVleft.elements.first() as go.Shape).stroke =
          this._verticalGuidelineColor;
      if (this.guidelineVright)
        (this.guidelineVright.elements.first() as go.Shape).stroke =
          this._verticalGuidelineColor;
    }
  }

  get centerGuidelineColor(): string {
    return this._centerGuidelineColor;
  }
  set centerGuidelineColor(val: string) {
    if (this._centerGuidelineColor !== val) {
      this._centerGuidelineColor = val;
      if (this.guidelineVcenter)
        (this.guidelineVcenter.elements.first() as go.Shape).stroke =
          this._centerGuidelineColor;
      if (this.guidelineHcenter)
        (this.guidelineHcenter.elements.first() as go.Shape).stroke =
          this._centerGuidelineColor;
    }
  }

  get guidelineWidth(): number {
    return this._guidelineWidth;
  }
  set guidelineWidth(val: number) {
    if (typeof val !== "number" || isNaN(val) || val < 0)
      throw new Error(
        "New value for GuidedDraggingTool.guidelineWidth must be a non-negative number."
      );
    if (this._guidelineWidth !== val) {
      this._guidelineWidth = val;
      if (this.guidelineVcenter)
        (this.guidelineVcenter.elements.first() as go.Shape).strokeWidth = val;
      if (this.guidelineHcenter)
        (this.guidelineHcenter.elements.first() as go.Shape).strokeWidth = val;
      if (this.guidelineVleft)
        (this.guidelineVleft.elements.first() as go.Shape).strokeWidth = val;
      if (this.guidelineVright)
        (this.guidelineVright.elements.first() as go.Shape).strokeWidth = val;
      if (this.guidelineHbottom)
        (this.guidelineHbottom.elements.first() as go.Shape).strokeWidth = val;
      if (this.guidelineHtop)
        (this.guidelineHtop.elements.first() as go.Shape).strokeWidth = val;
    }
  }

  get searchDistance(): number {
    return this._searchDistance;
  }
  set searchDistance(val: number) {
    if (typeof val !== "number" || isNaN(val) || val <= 0)
      throw new Error(
        "new value for GuidedDraggingTool.searchDistance must be a positive number."
      );
    this._searchDistance = val;
  }

  get isGuidelineSnapEnabled(): boolean {
    return this._isGuidelineSnapEnabled;
  }
  set isGuidelineSnapEnabled(val: boolean) {
    if (typeof val !== "boolean")
      throw new Error(
        "new value for GuidedDraggingTool.isGuidelineSnapEnabled must be a boolean."
      );
    this._isGuidelineSnapEnabled = val;
  }

  public clearGuidelines(): void {
    if (this.guidelineHbottom) this.diagram.remove(this.guidelineHbottom);
    if (this.guidelineHcenter) this.diagram.remove(this.guidelineHcenter);
    if (this.guidelineHtop) this.diagram.remove(this.guidelineHtop);
    if (this.guidelineVleft) this.diagram.remove(this.guidelineVleft);
    if (this.guidelineVright) this.diagram.remove(this.guidelineVright);
    if (this.guidelineVcenter) this.diagram.remove(this.guidelineVcenter);
  }

  public override doDeactivate(): void {
    super.doDeactivate();
    // clear any guidelines when dragging is done
    this.clearGuidelines();
  }

  /**
   * Shows vertical and horizontal guidelines for the dragged part.
   */
  public override doDragOver(pt: go.Point, obj: go.GraphObject): void {
    // clear all existing guidelines in case either show... method decides to show a guideline
    this.clearGuidelines();

    // gets the selected part
    const draggingParts = this.copiedParts || this.draggedParts;
    if (draggingParts === null) return;
    const partItr = draggingParts.iterator;
    if (partItr.next()) {
      const part = partItr.key;

      this.showHorizontalMatches(part, this.isGuidelineEnabled, false);
      this.showVerticalMatches(part, this.isGuidelineEnabled, false);
    }
  }

  /**
   * On a mouse-up, snaps the selected part to the nearest guideline.
   * If not snapping, the part remains at its position.
   */
  public override doDropOnto(pt: go.Point, obj: go.GraphObject): void {
    this.clearGuidelines();

    // gets the selected (perhaps copied) Part
    const draggingParts = this.copiedParts || this.draggedParts;
    if (draggingParts === null) return;
    const partItr = draggingParts.iterator;
    if (partItr.next()) {
      const part = partItr.key;

      // snaps only when the mouse is released without shift modifier
      const e = this.diagram.lastInput;
      const snap = this.isGuidelineSnapEnabled && !e.shift;

      this.showHorizontalMatches(part, false, snap); // false means don't show guidelines
      this.showVerticalMatches(part, false, snap);
    }
  }

  public invalidateLinks(node: go.Part): void {
    if (node instanceof go.Node) node.invalidateConnectedLinks();
  }

  /**
   * This predicate decides whether or not the given Part should guide the dragged part.
   * @param {Part} part  a stationary Part to which the dragged part might be aligned
   * @param {Part} guidedpart  the Part being dragged
   */
  protected isGuiding(part: go.Part, guidedpart: go.Part): boolean {
    return (
      part instanceof go.Part &&
      !part.isSelected &&
      !(part instanceof go.Link) &&
      guidedpart instanceof go.Part &&
      part.containingGroup === guidedpart.containingGroup &&
      part.layer !== null &&
      !part.layer.isTemporary
    );
  }

  /**
   * This finds parts that are aligned near the selected part along horizontal lines. It compares the selected
   * part to all parts within a rectangle approximately twice the {@link #searchDistance} wide.
   * The guidelines appear when a part is aligned within a margin-of-error equal to {@link #guidelineSnapDistance}.
   * @param {Node} part
   * @param {boolean} guideline if true, show guideline
   * @param {boolean} snap if true, snap the part to where the guideline would be
   */
  public showHorizontalMatches(
    part: go.Part,
    guideline: boolean,
    snap: boolean
  ): void {
    const objBounds = part.locationObject.getDocumentBounds();
    const p0 = objBounds.y;
    const p1 = objBounds.y + objBounds.height / 2;
    const p2 = objBounds.y + objBounds.height;

    const marginOfError = this.guidelineSnapDistance;
    let distance = this.searchDistance;
    if (distance === Infinity) distance = this.diagram.documentBounds.width;
    // compares with parts within narrow vertical area
    const area = objBounds.copy();
    area.inflate(distance, marginOfError + 1);
    const otherObjs = this.diagram.findObjectsIn(
      area,
      (obj) => obj.part as go.Part,
      (p) => this.isGuiding(p as go.Part, part),
      true
    ) as go.Set<go.Part>;

    let bestDiff: number = marginOfError;
    let bestObj: any = null; // TS 2.6 won't let this be go.Part | null
    let bestSpot: go.Spot = go.Spot.Default;
    let bestOtherSpot: go.Spot = go.Spot.Default;
    // horizontal line -- comparing y-values
    otherObjs.each((other) => {
      if (other === part) return; // ignore itself

      const otherBounds = other.locationObject.getDocumentBounds();
      const q0 = otherBounds.y;
      const q1 = otherBounds.y + otherBounds.height / 2;
      const q2 = otherBounds.y + otherBounds.height;

      // compare center with center of OTHER part
      if (this.guidelineHcenter && Math.abs(p1 - q1) < bestDiff) {
        bestDiff = Math.abs(p1 - q1);
        bestObj = other;
        bestSpot = go.Spot.Center;
        bestOtherSpot = go.Spot.Center;
      }
      // compare top side with top and bottom sides of OTHER part
      if (this.guidelineHtop && Math.abs(p0 - q0) < bestDiff) {
        bestDiff = Math.abs(p0 - q0);
        bestObj = other;
        bestSpot = go.Spot.Top;
        bestOtherSpot = go.Spot.Top;
      } else if (this.guidelineHtop && Math.abs(p0 - q2) < bestDiff) {
        bestDiff = Math.abs(p0 - q2);
        bestObj = other;
        bestSpot = go.Spot.Top;
        bestOtherSpot = go.Spot.Bottom;
      }
      // compare bottom side with top and bottom sides of OTHER part
      if (this.guidelineHbottom && Math.abs(p2 - q0) < bestDiff) {
        bestDiff = Math.abs(p2 - q0);
        bestObj = other;
        bestSpot = go.Spot.Bottom;
        bestOtherSpot = go.Spot.Top;
      } else if (this.guidelineHbottom && Math.abs(p2 - q2) < bestDiff) {
        bestDiff = Math.abs(p2 - q2);
        bestObj = other;
        bestSpot = go.Spot.Bottom;
        bestOtherSpot = go.Spot.Bottom;
      }
    });

    if (bestObj !== null) {
      const offsetX = objBounds.x - part.actualBounds.x;
      const offsetY = objBounds.y - part.actualBounds.y;
      const bestBounds = bestObj.locationObject.getDocumentBounds();
      // line extends from x0 to x2
      const x0 = Math.min(objBounds.x, bestBounds.x) - 10;
      const x2 =
        Math.max(
          objBounds.x + objBounds.width,
          bestBounds.x + bestBounds.width
        ) + 10;
      // find bestObj's desired Y
      const bestPoint = new go.Point().setRectSpot(bestBounds, bestOtherSpot);
      if (bestSpot === go.Spot.Center) {
        if (snap) {
          // call Part.move in order to automatically move member Parts of Groups
          part.move(
            new go.Point(
              objBounds.x - offsetX,
              bestPoint.y - objBounds.height / 2 - offsetY
            )
          );
          this.invalidateLinks(part);
        }
        if (guideline) {
          this.guidelineHcenter.position = new go.Point(x0, bestPoint.y);
          this.guidelineHcenter.elt(0).width = x2 - x0;
          this.diagram.add(this.guidelineHcenter);
        }
      } else if (bestSpot === go.Spot.Top) {
        if (snap) {
          part.move(new go.Point(objBounds.x - offsetX, bestPoint.y - offsetY));
          this.invalidateLinks(part);
        }
        if (guideline) {
          this.guidelineHtop.position = new go.Point(x0, bestPoint.y);
          this.guidelineHtop.elt(0).width = x2 - x0;
          this.diagram.add(this.guidelineHtop);
        }
      } else if (bestSpot === go.Spot.Bottom) {
        if (snap) {
          part.move(
            new go.Point(
              objBounds.x - offsetX,
              bestPoint.y - objBounds.height - offsetY
            )
          );
          this.invalidateLinks(part);
        }
        if (guideline) {
          this.guidelineHbottom.position = new go.Point(x0, bestPoint.y);
          this.guidelineHbottom.elt(0).width = x2 - x0;
          this.diagram.add(this.guidelineHbottom);
        }
      }
    }
  }

  /**
   * This finds parts that are aligned near the selected part along vertical lines. It compares the selected
   * part to all parts within a rectangle approximately twice the {@link #searchDistance} tall.
   * The guidelines appear when a part is aligned within a margin-of-error equal to {@link #guidelineSnapDistance}.
   * @param {Part} part
   * @param {boolean} guideline if true, show guideline
   * @param {boolean} snap if true, don't show guidelines but just snap the part to where the guideline would be
   */
  public showVerticalMatches(
    part: go.Part,
    guideline: boolean,
    snap: boolean
  ): void {
    const objBounds = part.locationObject.getDocumentBounds();
    const p0 = objBounds.x;
    const p1 = objBounds.x + objBounds.width / 2;
    const p2 = objBounds.x + objBounds.width;

    const marginOfError = this.guidelineSnapDistance;
    let distance = this.searchDistance;
    if (distance === Infinity) distance = this.diagram.documentBounds.height;
    // compares with parts within narrow vertical area
    const area = objBounds.copy();
    area.inflate(marginOfError + 1, distance);
    const otherObjs = this.diagram.findObjectsIn(
      area,
      (obj) => obj.part as go.Part,
      (p) => this.isGuiding(p as go.Part, part),
      true
    ) as go.Set<go.Part>;

    let bestDiff: number = marginOfError;
    let bestObj: any = null; // TS 2.6 won't let this be go.Part | null
    let bestSpot: go.Spot = go.Spot.Default;
    let bestOtherSpot: go.Spot = go.Spot.Default;
    // vertical line -- comparing x-values
    otherObjs.each((other) => {
      if (other === part) return; // ignore itself

      const otherBounds = other.locationObject.getDocumentBounds();
      const q0 = otherBounds.x;
      const q1 = otherBounds.x + otherBounds.width / 2;
      const q2 = otherBounds.x + otherBounds.width;

      // compare center with center of OTHER part
      if (this.guidelineVcenter && Math.abs(p1 - q1) < bestDiff) {
        bestDiff = Math.abs(p1 - q1);
        bestObj = other;
        bestSpot = go.Spot.Center;
        bestOtherSpot = go.Spot.Center;
      }
      // compare left side with left and right sides of OTHER part
      if (this.guidelineVleft && Math.abs(p0 - q0) < bestDiff) {
        bestDiff = Math.abs(p0 - q0);
        bestObj = other;
        bestSpot = go.Spot.Left;
        bestOtherSpot = go.Spot.Left;
      } else if (this.guidelineVleft && Math.abs(p0 - q2) < bestDiff) {
        bestDiff = Math.abs(p0 - q2);
        bestObj = other;
        bestSpot = go.Spot.Left;
        bestOtherSpot = go.Spot.Right;
      }
      // compare right side with left and right sides of OTHER part
      if (this.guidelineVright && Math.abs(p2 - q0) < bestDiff) {
        bestDiff = Math.abs(p2 - q0);
        bestObj = other;
        bestSpot = go.Spot.Right;
        bestOtherSpot = go.Spot.Left;
      } else if (this.guidelineVright && Math.abs(p2 - q2) < bestDiff) {
        bestDiff = Math.abs(p2 - q2);
        bestObj = other;
        bestSpot = go.Spot.Right;
        bestOtherSpot = go.Spot.Right;
      }
    });

    if (bestObj !== null) {
      const offsetX = objBounds.x - part.actualBounds.x;
      const offsetY = objBounds.y - part.actualBounds.y;
      const bestBounds = bestObj.locationObject.getDocumentBounds();
      // line extends from y0 to y2
      const y0 = Math.min(objBounds.y, bestBounds.y) - 10;
      const y2 =
        Math.max(
          objBounds.y + objBounds.height,
          bestBounds.y + bestBounds.height
        ) + 10;
      // find bestObj's desired X
      const bestPoint = new go.Point().setRectSpot(bestBounds, bestOtherSpot);
      if (bestSpot === go.Spot.Center) {
        if (snap) {
          // call Part.move in order to automatically move member Parts of Groups
          part.move(
            new go.Point(
              bestPoint.x - objBounds.width / 2 - offsetX,
              objBounds.y - offsetY
            )
          );
          this.invalidateLinks(part);
        }
        if (guideline) {
          this.guidelineVcenter.position = new go.Point(bestPoint.x, y0);
          this.guidelineVcenter.elt(0).height = y2 - y0;
          this.diagram.add(this.guidelineVcenter);
        }
      } else if (bestSpot === go.Spot.Left) {
        if (snap) {
          part.move(new go.Point(bestPoint.x - offsetX, objBounds.y - offsetY));
          this.invalidateLinks(part);
        }
        if (guideline) {
          this.guidelineVleft.position = new go.Point(bestPoint.x, y0);
          this.guidelineVleft.elt(0).height = y2 - y0;
          this.diagram.add(this.guidelineVleft);
        }
      } else if (bestSpot === go.Spot.Right) {
        if (snap) {
          part.move(
            new go.Point(
              bestPoint.x - objBounds.width - offsetX,
              objBounds.y - offsetY
            )
          );
          this.invalidateLinks(part);
        }
        if (guideline) {
          this.guidelineVright.position = new go.Point(bestPoint.x, y0);
          this.guidelineVright.elt(0).height = y2 - y0;
          this.diagram.add(this.guidelineVright);
        }
      }
    }
  }
}

export default GuidedDraggingTool;
