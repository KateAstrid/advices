import { FC } from "react";

interface Props {
  onClick: () => void;
}

export const ModalWindow: FC<Props> = ({ onClick }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClick}>
          &times;
        </span>
        <p>
          There was an error with the fetching advice.
          <br />
          Please, try again.
        </p>
      </div>
    </div>
  );
};
