import React from 'react'
import { modalStyles as styles } from '../assets/dummystyle'
import { X } from 'lucide-react'

const Modal = ({
  children, isOpen, onClose, title, hideHeader, showActionBtn, actionBtnIcom = null,
  actionBtnText, onActionClick = () => { },
}) => {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {!hideHeader && (
          <>
            <h3 className={styles.title}>
              {title}
            </h3>

            {showActionBtn && (
              <button className={styles.actionButton} onClick={onActionClick}>
                {actionBtnIcom}
                {actionBtnText}
              </button>
            )}
          </>
        )}

        <button type="button" className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
