import { useRef, useState } from "react";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import "./App.css";

type Sizes = {
  form: number;
  actions: number;
  console: number;
  status: number;
};

type ResizeHandleProps = {
  className?: string;
  id?: string;
};

function ResizeHandle({ id }: ResizeHandleProps) {
  return <PanelResizeHandle className="ResizeHandle" id={id} />;
}

function App() {
  const [direction, setDirection] = useState(window.localStorage.getItem('console-position') || 'vertical');

  const [showDebugger, setShowDebugger] = useState(eval(window.localStorage.getItem('show-debugger')) || false);

  const setDirectionState = (_direction: string) => {
    setDirection(_direction)
    window.localStorage.setItem('console-position', _direction)
  }

  const formPanelRef = useRef<ImperativePanelHandle>(null);
  const consolePanelRef = useRef<ImperativePanelHandle>(null); 

  const formPanel = (
    <div className="Centered" style={{ backgroundColor: "gray" }}>
      form content {direction}
    </div>
  );

  const actionBar = (
    <div className="Centered" style={{ backgroundColor: "darkgrey", height: "36px", flex: "none" }}>
      actions come here
    </div>
  );

  const statusBar = (
    <div className="Centered" style={{ backgroundColor: "darkcyan", height: "22px", flex: "none" }}>
      status bar  
      <button onClick={() => {
        if (!consolePanelRef.current?.isCollapsed()) {
          localStorage.setItem("show-debugger", !showDebugger);
          setShowDebugger(!showDebugger);
        }
        if (consolePanelRef.current?.isCollapsed()) {
          consolePanelRef.current.expand();
          consolePanelRef.current.resize(30);
        }
      }}>debug</button>
    </div>
  );

  const consolePanel = (
    <div>
      <p>console:</p>
      <p><button onClick={() => {
        if (direction === 'vertical') { setDirectionState('horizontal')} else { setDirectionState('vertical') }
      }}>Toggle position</button></p>
    </div>
  );

  const verticalLayout = (
    <div className="PanelGroupWrapper">
      <PanelGroup 
        autoSaveId="vertical" 
        direction="vertical">
        <Panel id="form-vertical" order={1} className="PanelColumn" ref={formPanelRef}>
          {formPanel}
        </Panel>
        {actionBar}

        { showDebugger && (
          <>
            <ResizeHandle className="ResizeHandle" />
            <Panel
              className="PanelColumn"
              collapsible
              minSize={5}
              order={2}
              id="debugger-vertical"
              ref={consolePanelRef}>
                {consolePanel}
            </Panel>
          </>
        )}

        {statusBar}
      </PanelGroup>
    </div>
  );

  const horizontalLayout = (
    <div className="PanelGroupWrapper">
      <PanelGroup autoSaveId="horizontal" direction="horizontal">
        <Panel id="form-row-wrapper" order={1} className="PanelRow" minSize={10}>
          <PanelGroup direction="vertical">
            <Panel id="form-horizontal" className="PanelColumn" ref={formPanelRef}>
              {formPanel}
            </Panel>
            {actionBar}
            {statusBar}
          </PanelGroup>
        </Panel>
        
        { showDebugger && (
          <>
            <ResizeHandle className="ResizeHandle" />
            <Panel
              className="PanelRow"
              collapsible
              id="debugger-horizontal"
              order={2}
              minSize={5}
              ref={consolePanelRef}>
              {consolePanel}
            </Panel>
          </>
        ) }

      </PanelGroup>
    </div>
  );

  return direction === 'vertical' ? verticalLayout : horizontalLayout

}

export default App;
