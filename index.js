/**
 * node-red-contrib-ventuz-osc
 * Node-RED nodes for Ventuz OSC communication
 */

module.exports = function(RED) {
    RED.nodes.registerType("ventuz-broadcast", require("./nodes/ventuz-broadcast"));
    RED.nodes.registerType("ventuz-subscribe", require("./nodes/ventuz-subscribe"));
};
