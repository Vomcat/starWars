import { forwardRef, InputHTMLAttributes } from "react";

import styles from "./Input.module.css";

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const { ...inputAtributes } = props;
  return <input className={styles.input} ref={ref} {...inputAtributes} />;
});

export default Input;
