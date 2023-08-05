interface NodeDialogProps {
  open: boolean;
  handleClose: () => void;
  createNode: (pol: "pro" | "con") => void;
  clientX: number;
  clientY: number;
}

const CreateNode: React.FC<NodeDialogProps> = ({
  open,
  handleClose,
  createNode,
  clientX,
  clientY,
}) => {
  return (
    <div className="dialog-container">
      {open && (
        <div className="dialog-box" style={{ top: clientY, left: clientX }}>
          <div className="dialog-header">
            <span className="dialog-title">Add Node</span>
            <div className="close-btn-wrapper">
              <button className="close-btn" onClick={handleClose}>
              </button>
            </div>
          </div>
          <div className="button-group">
            <button onClick={() => handleClick("pro")} className="pro btn">
              Pro
            </button>
            <button onClick={() => handleClick("con")} className="con btn">
              Con
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function handleClick(pol: "pro" | "con") {
    createNode(pol);
    handleClose();
  }
};

export default CreateNode;
