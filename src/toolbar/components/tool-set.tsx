import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { TextListButton } from './text-list-button';
import { ToggleIconButton } from './toggle-icon-button';
import { ColorListButton } from './color-list-button';
import type { ColorListData, TextListData, ToggleData } from '../../types';
import { formatType } from '../../constants/formats';

interface Props {
  tools: Array<ToggleData | TextListData | ColorListData>;
  style: StyleProp<ViewStyle>;
  toolStyle: StyleProp<ViewStyle>;
}

export const ToolSet: React.FC<Props> = (props) => {
  const { tools, style, toolStyle } = props;
  const renderToggle = (index: number, data: ToggleData) => (
    <ToggleIconButton
      key={index}
      name={data.name}
      source={data.source}
      valueOff={data.valueOff}
      valueOn={data.valueOn}
      style={toolStyle}
    />
  );

  const renderTextList = (index: number, data: TextListData) => (
    <TextListButton
      key={index}
      alias={data.alias}
      styleAlias={data.styleAlias}
      source={data?.source}
      name={data.name}
      items={data.values}
      style={toolStyle}
    />
  );

  const renderColorList = (index: number, data: ColorListData) => (
    <ColorListButton
      key={index}
      name={data.name}
      items={data.values}
      source={data.source}
      style={toolStyle}
    />
  );

  return (
    <View style={[styles.toolset, style]}>
      {tools.map((tool, index) => {
        const { type } = tool;
        if (type === formatType.select) {
          return renderTextList(index, tool as TextListData);
        } else if (type === formatType.color) {
          return renderColorList(index, tool as ColorListData);
        } else {
          return renderToggle(index, tool as ToggleData);
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  toolset: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 3,
    paddingRight: 3,
    marginRight: 1,
  },
});
