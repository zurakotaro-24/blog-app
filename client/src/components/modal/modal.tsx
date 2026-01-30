import React from "react";
import styles from "./modal.module.css";

interface ModalProps {
    open: boolean; 
    onClose: () => void;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
    if(!open) return null;

    return (
        <div className={styles["modal-backdrop"]} onClick={onClose}>
            <div className={styles["modal-container"]} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
