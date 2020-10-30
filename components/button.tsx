import React from 'react';
import styles from '../styles/Button.module.scss';

interface ButtonProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function Button({ label, onClick }: ButtonProps) {
  return <a className={styles.button} onClick={onClick}>{label}</a>;
}