
require('dotenv').config();


exports.groupByCategory = async (objectArray) => {
    return objectArray.filter((tag, index, array) => array.findIndex(t => t.id == tag.id) == index); //search where id same then reduce for grouping

};

exports.groupById = async (objectArray) => {
    return objectArray.filter((tag, index, array) => array.findIndex(t => t.id == tag.id) == index); //search where id same then reduce for grouping

};

exports.groupByOrder = async (objectArray) => {
    return objectArray.filter((tag, index, array) => array.findIndex(t => t.detail_order == tag.detail_order) == index); //search where id same then reduce for grouping

};
