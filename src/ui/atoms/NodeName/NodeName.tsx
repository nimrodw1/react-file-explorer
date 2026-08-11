import { Text, type TextProps } from '@mantine/core';
import classes from './NodeName.module.css';

export interface NodeNameProps extends Omit<TextProps, 'children'> {
  name: string;
  muted?: boolean;
}

export function NodeName({ name, muted = false, className, ...rest }: NodeNameProps) {
  return (
    <Text
      component="span"
      size="sm"
      className={`${classes.root} ${muted ? classes.muted : ''} ${className ?? ''}`}
      title={name}
      {...rest}
    >
      {name}
    </Text>
  );
}
