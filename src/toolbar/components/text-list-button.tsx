import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  StyleProp,
} from 'react-native';
import type { ToggleData, ToolbarTheme } from '../../types';
import type { ImageSourcePropType } from 'react-native';
import { useToolbar } from './toolbar-context';

interface Props {
  name: string;
  alias?: string;
  styleAlias?: string;
  source?: ImageSourcePropType;
  items: Array<ToggleData>;
  style: StyleProp<ViewStyle>;
}

export const TextListButton: React.FC<Props> = ({
  name,
  source,
  alias,
  styleAlias,
  items,
  style,
}) => {
  const { theme, show, hide, open, selectionName, getSelected } = useToolbar();
  const styles = makeStyles(theme);

  const showMenu = () => {
    if (open && selectionName === name) hide();
    else show(name, items);
  };

  const matchSelection = (x: ToggleData, selectedValue: string | boolean) => {
    if (alias && styleAlias) {
      if (x.valueOn === false && selectedValue === false) return true;
      if (typeof selectedValue === 'string')
        return selectedValue.includes(`${styleAlias}: ${x.valueOn}`);
      else {
        return false;
      }
    } else {
      return x.valueOn === selectedValue;
    }
  };

  const selectedValue = getSelected(alias ?? name);
  const selectedItem = items.find((x) => matchSelection(x, selectedValue));
  const isOpen = selectionName === name;

  const getListComponent = () => {
    if (selectedItem?.source) {
      return <Image source={selectedItem.source} style={[styles.image]} />;
    } else if (selectedItem && selectedItem.name) {
      return (
        <Text style={styles.text}>
          {selectedItem ? selectedItem.name : name}
        </Text>
      );
    } else {
      if (source) {
        return <Image source={source} style={[styles.image]} />;
      } else {
        return <Text style={styles.text}>{name}</Text>;
      }
    }
  };

  return (
    <TouchableOpacity onPress={showMenu}>
      <View style={[styles.tool, style]}>
        {getListComponent()}
        {isOpen && <View style={[styles.overlay]} />}
      </View>
    </TouchableOpacity>
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
      padding: 2,
      marginRight: 4,
      marginLeft: 4,
      height: Math.round(theme.size),
    },
    image: {
      height: Math.round(theme.size * 0.6),
      width: Math.round(theme.size * 0.6),
      tintColor: theme.color,
    },
    text: {
      color: theme.color,
      fontWeight: 'bold',
    },
  });
