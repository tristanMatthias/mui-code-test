import React, { useMemo, useState, useEffect, useRef } from 'react';
import './panes.scss';


export interface PanesProps {
  /** Enable vertical panes */
  vertical?: boolean;
  /** Panes to render */
  panes: JSX.Element[];
}


export const Panes: React.FunctionComponent<PanesProps> = ({
  vertical,
  panes
}) => {
  /** Percentages of each pane (Updated on `pane` update) */
  const [positions, setPositions] = useState<number[]>([]);
  /** This element */
  const container = useRef<HTMLDivElement>(null);
  /** Border box of this element */
  const [box, setBox] = useState<ClientRect>();

  /** Update grid template rows/cols on position update */
  const styles: React.CSSProperties = useMemo(() => {
    const template = positions.map(p => `${p * 100}fr `).join(' 4px ');
    return {
      [vertical ? 'gridTemplateRows' : 'gridTemplateColumns']: template
    };
  }, [positions]);


  // TODO: Insert relatively
  /** Reset positions on new panes */
  useEffect(() => {
    const size = panes.length;
    setPositions(new Array(size).fill(1 / size));
  }, [panes]);

  /** Get the bounding box */
  useEffect(() => {
    if (container.current) setBox(container.current.getBoundingClientRect());
  }, [container.current]);


  /** Enable dragging */
  const setDragging = (i: number) => (_e: React.MouseEvent<any>) => {
    if (!box) return;
    // Sum the size of panes before
    const min = positions.slice(0, i).reduce((a, b) => a + b, 0);
    // Sum the size of panes after
    const max = positions.slice(i + 2).reduce((a, b) => a + b, 0);
    // Don't drag past..
    const upper = 1 - max;
    // Remaining space to drag in
    const leftOver = 1 - min - max;


    const handleDrag = (e: MouseEvent) => {
      if (!box) return;
      // Get the offset
      const offset = vertical ? e.clientY - box.top : e.clientX - box.left;

      // Get the percentage relative eto ENTIRE container
      const perc = (offset / (vertical ? box.height : box.width));
      // Adjust the perc to lower and upper bounds
      const adjusted = (perc - min) / (upper - min);
      // Clone...
      const update = [...positions];
      // Calculate the two panes the handle effects based on the `leftOver` and `adjusted`
      update[i] = adjusted * leftOver;
      update[i + 1] = (1 - adjusted) * leftOver;
      setPositions(update);
    };

    // TODO: Debounce this
    window.addEventListener('mousemove', handleDrag);
    // Once dragging is done, remove handler
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', handleDrag);
    });
  };


  return <div style={styles} className="panes" ref={container}>
    {panes.map((p, i) => <>
      {p}
      {/* Don't render handle for last pane */}
      {(i !== panes.length - 1) &&
        <div
          className="handle"
          onMouseDown={setDragging(i)}
        />
      }
    </>)}
  </div>;
};
