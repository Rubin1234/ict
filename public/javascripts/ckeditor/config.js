/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    config.filebrowserBrowseUrl = '../../../elfinder/ckeditor';

    config.enterMode = CKEDITOR.ENTER_BR; // pressing the ENTER KEY input <br/>
    config.shiftEnterMode = CKEDITOR.ENTER_P; //pressing the SHIFT + ENTER KEYS input <p>
    config.autoParagraph = false; // stops automatic insertion of <p> on focus
    config.AllowedContent = "br[clear]";

    // Toolbar configuration generated automatically by the editor based on config.toolbarGroups.
    config.toolbar = [
        {name: 'document', groups: ['mode', 'doctools'], items: ['Source', '-', 'Templates']},
        {name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Paste', '-', 'Undo', 'Redo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker'], items: ['']},
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'insert', items: ['Image', 'Table', 'HorizontalRule']},
        {name: 'iframe', items: ['Iframe', 'Youtube', 'wenzgmap']},
        {name: 'colors', items: ['TextColor', 'BGColor']},
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike']},
        {name: 'text-align', groups: ['align'], items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']},
        {name: 'blocks', groups: ['blocks', 'bidi'], items: ['Blockquote', 'CreateDiv', 'btgrid']},
        {name: 'format', items: ['Format']},
        {name: 'font', items: ['Font']},
        {name: 'fontSize', items: ['FontSize']},
        {name: 'print', items: ['Print']},
        {name: 'tools', items: ['Maximize']}
    ];

// Toolbar groups configuration.
    config.toolbarGroups = [
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
        {name: 'links'},
        {name: 'insert'},
        {name: 'forms'},
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'text-align', groups: ['align']},
        {name: 'colors'},
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'bidi']},
        {name: 'styles'},
        {name: 'others'},
        {name: 'tools'},
        {name: 'about'}
    ];

    // Remove some buttons provided by the standard plugins, which are
    // not needed in the Standard(s) toolbar.
	config.removeButtons = 'Subscript,Superscript,Flash,Smiley,PageBreak,BidiRtl,BidiLtr,Scayt,SpecialChar,ShowBlocks,Cut,Copy';



    config.font_names = 'Calibri;preeti;';

};
