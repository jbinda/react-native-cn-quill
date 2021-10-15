import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { fullOptions, basicOptions } from '../constants/toolbar-options';
import type {
  ToolbarTheme,
  TextListData,
  ToggleData,
  ColorListData,
  ToolbarCustom,
} from '../types';
import { lightTheme, darkTheme } from '../constants/themes';
import { getToolbarData } from '../utils/toolbar-utils';
import type QuillEditor from '../editor/quill-editor';
import { ToolbarProvider } from './components/toolbar-context';
import { SelectionBar } from './components/selection-bar';
import { ToolSet } from './components/tool-set';
import { ToolbarSeperator } from './components/toolbar-separator';
import type { FormatChangeData } from '../constants/editor-event';

const WIDTH = Dimensions.get('window').width;

interface customStyles {
  toolbar?: StyleProp<ViewStyle>;
  selection: StyleProp<ViewStyle>;
  toolset?: object;
  tool?: object;
  contentContainer?: StyleProp<ViewStyle>;
  itemContainer?: StyleProp<ViewStyle>;
}

interface QuillToolbarProps {
  options: Array<Array<string | object> | string | object> | 'full' | 'basic';
  styles?: customStyles;
  editor: React.RefObject<QuillEditor>;
  theme: ToolbarTheme | 'dark' | 'light';
  custom?: ToolbarCustom;
  container?: false | 'avoiding-view' | React.ComponentType;
}

interface ToolbarState {
  toolSets: Array<Array<ToggleData | TextListData | ColorListData>>;
  availableSelections: string[];
  formats: object;
  theme: ToolbarTheme;
}

export class QuillToolbar extends Component<QuillToolbarProps, ToolbarState> {
  public static defaultProps = {
    theme: 'dark',
  };

  constructor(props: QuillToolbarProps) {
    super(props);
    this.state = {
      toolSets: [],
      availableSelections: [],
      formats: {},
      theme: lightTheme,
    };
  }

  editor?: QuillEditor;

  componentDidMount() {
    this.listenToEditor();
    this.prepareIconset();
    this.changeTheme();
  }

  componentDidUpdate(prevProps: QuillToolbarProps) {
    if (prevProps.options !== this.props.options) {
      this.prepareIconset();
    }
    if (prevProps.theme !== this.props.theme) {
      this.changeTheme();
    }
  }

  changeTheme() {
    let theme: ToolbarTheme = lightTheme;

    if (this.props.theme === 'dark') {
      theme = darkTheme;
    } else if (this.props.theme !== 'light') {
      theme = this.props.theme;
    }
    this.setState({ theme });
  }

  private prepareIconset = () => {
    const { options, custom } = this.props;
    let toolbarOptions: Array<Array<string | object> | string | object> = [];
    if (options === 'full' || options === []) {
      toolbarOptions = fullOptions;
    } else if (options === 'basic') {
      toolbarOptions = basicOptions;
    } else {
      toolbarOptions = options;
    }
    const toolSets = getToolbarData(toolbarOptions, custom?.icons);
    const availableSelections = toolSets.flat().map((set) => set.name);

    this.setState({ toolSets, availableSelections });
  };

  private listenToEditor = () => {
    setTimeout(() => {
      const {
        editor: { current },
      } = this.props;
      if (current) {
        this.editor = current;
        current.on('format-change', this.onFormatChange);
      }
    }, 200);
  };

  private onFormatChange = (data: FormatChangeData) => {
    this.setState({ formats: data.formats });
  };

  private format = (name: string, value: any) => {
    this.editor?.format(name, value);
  };

  renderToolbar = () => {
    const { styles, custom } = this.props;
    const { toolSets, theme, formats, availableSelections } = this.state;
    const classes = makeStyles(theme);
    return (
      <ToolbarProvider
        theme={theme}
        format={this.format}
        selectedFormats={formats}
        custom={custom}
        availableSelections={availableSelections}
      >
        <SelectionBar
          toolStyle={styles?.tool}
          selectionStyle={styles?.selection}
        />
        <View style={[styles?.toolbar || classes.toolbar]}>
          <ScrollView
            horizontal={true}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles?.contentContainer || classes.contentContainer,
            ]}
          >
            {toolSets.map((object, index) => {
              return (
                object.length > 0 && (
                  <View
                    key={index}
                    style={[styles?.itemContainer || classes.itemContainer]}
                  >
                    <ToolSet
                      tools={object}
                      style={styles?.toolset}
                      toolStyle={styles?.tool}
                    />
                    {toolSets.length > index &&
                      index !== toolSets.length - 1 && (
                        <ToolbarSeperator color={theme.color} />
                      )}
                  </View>
                )
              );
            })}
          </ScrollView>
        </View>
      </ToolbarProvider>
    );
  };

  render() {
    const { container = 'avoiding-view' } = this.props;
    if (container === 'avoiding-view')
      return (
        <KeyboardAvoidingView
          onTouchStart={(e) => e.stopPropagation()}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {this.renderToolbar()}
        </KeyboardAvoidingView>
      );
    else if (container === false) return this.renderToolbar();
    else {
      const ContainerComponent = container;
      return <ContainerComponent>{this.renderToolbar()}</ContainerComponent>;
    }
  }
}

const makeStyles = (theme: ToolbarTheme) =>
  StyleSheet.create({
    toolbar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: WIDTH,
      padding: 2,
      backgroundColor: theme.background,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: theme.size + 8,
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    itemContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
    },
  });
