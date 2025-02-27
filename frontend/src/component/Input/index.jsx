
import "./input.scss";

const Input = () => {
  return (
    <div class="input-container">
      <input
        type="text"
        id="editable-input"
        disabled
        placeholder=""
      />
      <span class="edit-icon" onclick="toggleEdit()">
        ✏️
      </span>
    </div>
  );
};

export default Input;
