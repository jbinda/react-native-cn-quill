import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';

interface Props {
  valueName: string;
  valueOn: string | number | boolean;
  valueOff?: string | number | boolean;
  style: StyleProp<ViewStyle>;
  name: string;
  alias?: string;
  styleAlias?: string;
}

export const ToggleTextButton: React.FC<Props> = (props) => {
  const { apply, isSelected, theme } = useToolbar();
  const {
    name,
    alias,
    valueOff,
    valueOn,
    valueName,
    styleAlias,
    style,
  } = props;

  let isSelectionCheck;
  if (alias && styleAlias) {
    isSelectionCheck = (value: any, selected?: any) => {
      // console.log('IS SELECTED CALLBACK');
      // console.log('SELECTED', selected);
      // console.log('VALUE', value);

      if (
        valueOn === false &&
        value === false &&
        !selected.includes(styleAlias)
      )
        return true;
      return selected.includes(`${styleAlias}: ${value}`);
    };
  }

  const selected = isSelected(alias ?? name, valueOn, isSelectionCheck);
  const handlePresss = () => apply(name, selected ? valueOff : valueOn);
  const styles = makeStyles(theme);
  return (
    <TouchableWithoutFeedback onPress={handlePresss}>
      <View style={[styles.tool, style]}>
        <Text style={styles.text}>{valueName}</Text>
        {selected && <View style={[styles.overlay]} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const makeStyles = (theme: ToolbarTheme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.overlay,
      borderRadius: 3,
    },
    tool: {
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      marginRight: 4,
      marginLeft: 4,
      height: Math.round(theme.size),
    },
    text: {
      color: theme.color,
      fontWeight: 'bold',
    },
  });

ToggleTextButton.defaultProps = {
  valueOff: false,
};
