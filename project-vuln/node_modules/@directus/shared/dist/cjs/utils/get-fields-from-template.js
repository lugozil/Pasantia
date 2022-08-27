"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsFromTemplate = void 0;
function getFieldsFromTemplate(template) {
    if (template === null)
        return [];
    const regex = /{{(.*?)}}/g;
    let fields = template.match(regex);
    if (!Array.isArray(fields)) {
        return [];
    }
    fields = fields.map((field) => {
        return field.replace(/{{/g, '').replace(/}}/g, '').trim();
    });
    return fields;
}
exports.getFieldsFromTemplate = getFieldsFromTemplate;
