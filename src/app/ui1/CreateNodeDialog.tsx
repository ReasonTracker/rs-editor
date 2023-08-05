interface NodeDialogProps {
  open: boolean;
  handleClose: () => void;
  createNode: () => void;
  clientX: number, 
  clientY: number,
}

const CreateNode: React.FC<NodeDialogProps> = ({
  open,
  handleClose,
  createNode,
  clientX,
  clientY,
}) => {

  return (
    <div>
      {open && (
        <div className="dialog-box" style={{ top: clientY, left: clientX }}>
          <div className="button-group">
            <button onClick={handleClick} className="pro btn">
              Pro
            </button>
            <span>or</span>
            <button onClick={handleClick} className="con btn">
              Con
            </button>
          </div>
          <button className="close-btn" onClick={handleClose}>
            X
          </button>
        </div>
      )}
    </div>
  );

  function handleClick() {
    createNode();
    handleClose();
  }

};

export default CreateNode;
