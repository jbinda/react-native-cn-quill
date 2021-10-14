import { formats, formatType, formatValueType } from '../constants/formats';
import type { ImageSourcePropType } from 'react-native';
import type {
  ColorListData,
  formatDefault,
  TextListData,
  ToggleData,
} from '../types';
import { icons as defaultIcons } from '../constants/icons';

type ValueItem = {
  name: string;
  default?: boolean;
  value: any;
  icon: ImageSourcePropType;
  type?: formatValueType;
};

export const getToolbarData = (
  options: Array<Array<string | object> | string | object>,
  customIcons?: Record<string, any>
): Array<Array<ToggleData | TextListData | ColorListData>> => {
  let iconSet: Array<Array<ToggleData | TextListData | ColorListData>> = [];
  const icons = customIcons
    ? { ...defaultIcons, ...customIcons }
    : defaultIcons;

  const isSingle: boolean = !(options.length > 0 && Array.isArray(options[0]));
  if (isSingle) {
    const set = createToolSet(options, icons);
    iconSet.push(set);
  } else {
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      if (Array.isArray(opt)) {
        const set = createToolSet(opt, icons);
        iconSet.push(set);
      } else
        console.log(opt, 'is not an array, you should pass it as an array');
    }
  }

  return iconSet;
};

const createToolSet = (
  tools: Array<string | object>,
  icons: Record<string, any>
): Array<ToggleData | TextListData | ColorListData> => {
  let ic: Array<ToggleData | TextListData | ColorListData> = [];
  for (let i = 0; i < tools.length; i++) {
    const opt = tools[i];

    if (typeof opt === 'string') {
      const format = formats.find((f) => f.name === opt);
      if ((format && format.type === formatType.toggle) || !format) {
        const formatIcon = icons[opt];
        if (formatIcon) {
          ic.push({
            name: opt,
            source: formatIcon,
            valueOff: false,
            valueOn: true,
            type: formatType.toggle,
          } as ToggleData);
        } else {
          ic.push({
            name: opt,
            valueOff: false,
            valueOn: true,
            type: formatType.toggle,
          } as ToggleData);
        }
      }
    } else if (typeof opt === 'object' && opt !== null) {
      const keys = Object.keys(opt);
      const values = Object.values(opt);
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const value = values[j];
        const format = formats.find((f) => f.name === key);
        if (typeof value === 'string' || typeof value === 'number') {
          const formatIcon = icons[key][value];
          if (formatIcon) {
            ic.push({
              name: key,
              source: formatIcon,
              valueOff: false,
              valueOn: value,
              type: formatType.toggle,
            } as ToggleData);
          } else {
            ic.push({
              name: key,
              valueOff: false,
              valueOn: value,
              type: formatType.toggle,
            } as ToggleData);
          }
        } else if (Array.isArray(value)) {
          const formatIcon = icons[key];
          let listItems: formatDefault[] = [];
          if ((!format || format.allowCustoms === true) && value.length > 0) {
            listItems = value.map((v) => {
              const def = format?.defaults?.find((f) => f.value === v);
              return def
                ? def
                : ({
                    name: v,
                    value: v,
                    type: formatValueType.text,
                  } as formatDefault);
            });
          } else if (format?.defaults && value.length === 0) {
            listItems = format.defaults;
          } else if (format?.defaults && value.length > 0) {
            listItems = format.defaults.filter(
              (f) => value.indexOf(f.value) !== -1
            );
          }
          if (listItems.length > 0) {
            if (!format || format.type === formatType.select) {
              ic.push({
                name: key,
                source: formatIcon,
                values: listItems.map((x) => {
                  let icon =
                    x.type === formatValueType.icon
                      ? x.value === false
                        ? icons[key]['']
                        : typeof x.value === 'string'
                        ? icons[key][x.value]
                        : undefined
                      : undefined;

                  return {
                    name: x.name,
                    valueOff: false,
                    valueOn: x.value,
                    source: icon,
                    type: (
                      x.type === formatValueType.icon && icon ? true : false
                    )
                      ? formatType.icon
                      : formatType.toggle,
                  } as ToggleData;
                }),
                type: formatType.select,
              } as TextListData);
            } else {
              ic.push({
                name: key,
                source: formatIcon,
                values: listItems.map(
                  (x) =>
                    ({
                      name: x.name,
                      valueOff: false,
                      valueOn: x.value,
                      type: formatType.color,
                    } as ToggleData)
                ),
                type: formatType.color,
              } as ColorListData);
            }
          } else {
            const fIcon = icons[key];
            if (fIcon) {
              ic.push({
                name: key,
                source: fIcon,
                valueOff: false,
                valueOn: true,
                type: formatType.toggle,
              } as ToggleData);
            }
          }
        } else if (typeof value === 'object') {
          const formatIcon = icons[key];
          const icon = value.icon;
          const listItems = value.values;
          const alias = value.alias;
          const styleAlias = value.styleAlias;

          if (listItems.length > 0) {
            if (!format || format.type === formatType.select) {
              ic.push({
                name: key,
                alias,
                styleAlias,
                source: icon || formatIcon,
                values: listItems
                  .map((x: string | ValueItem) => {
                    if (typeof x === 'string') {
                      return {
                        name: x,
                        alias,
                        styleAlias,
                        valueOff: false,
                        valueOn: x,
                        source: icon,
                        type: formatType.toggle,
                      } as ToggleData;
                    } else if (typeof x === 'object') {
                      return {
                        name: x.name,
                        alias,
                        styleAlias,
                        valueOff: false,
                        valueOn: x.default ? false : x.value,
                        source: x.icon || icons[x.name],
                        type: (
                          x.type === formatValueType.icon && icon ? true : false
                        )
                          ? formatType.icon
                          : formatType.toggle,
                      } as ToggleData;
                    }
                    return;
                  })
                  .filter((itemValue: any) => itemValue != null),
                type: formatType.select,
              } as TextListData);
            }
          }
        }
      }
    }
  }
  return ic;
};
