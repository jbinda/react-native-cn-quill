export const create_quill = (
  id: string,
  toolbar: 'false' | string,
  placeholder: string,
  theme: 'snow' | 'bubble'
) => `
<script>

var fontSizeStyle = Quill.import('attributors/style/size');
fontSizeStyle.whitelist = ["8px","9px","10px","11px","12px","14px","16px","18px","20px","22px","24px","26px","28px","36px","48px","72px"];
Quill.register(fontSizeStyle, true);

var quill = new Quill('#${id}', {
  modules: {
    toolbar: ${toolbar}
  },
  placeholder: '${placeholder}',
  theme: '${theme}'
});
</script>
`;
