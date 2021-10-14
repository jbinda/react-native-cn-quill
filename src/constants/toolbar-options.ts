const fullOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  [
    {
      size: [
        '8px',
        '9px',
        '10px',
        '11px',
        '12px',
        false,
        '14px',
        '16px',
        '18px',
        '20px',
        '22px',
        '24px',
        '26px',
        '28px',
        '36px',
        '48px',
        '72px',
      ],
    },
  ], // custom dropdown

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['image', 'video'],
  // ["clean"], // remove formatting button
];

const basicOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
];

export { fullOptions, basicOptions };
