import "./index.scss";


const ButtonBordered = ({ type, caption, onClick, disabled }) => {
  return <button className="button-bordered" type={type} onClick={onClick} disabled={disabled}>{ caption }</button>
}

const Button = ({ type, caption, onClick, disabled }) => {
  if (type == "bordered") {
    return ButtonBordered({ type, caption, onClick, disabled });
  }
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="button"
    >
      {caption}
    </button>
  );
};

export default Button;
