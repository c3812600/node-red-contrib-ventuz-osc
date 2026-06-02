/**
 * Ventuz Broadcast Node
 * 向 Ventuz 广播 OSC 消息
 */

module.exports = function(RED) {
    function VentuzBroadcastNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        // 配置
        node.host = config.host;
        node.port = parseInt(config.port) || 9000;
        node.address = config.address || '/ventuz/broadcast';
        
        // 状态
        node.connected = false;
        
        // 初始化 UDP socket
        var dgram = require('dgram');
        node.socket = dgram.createSocket('udp4');
        
        // 连接到 Ventuz
        node.on('input', function(msg) {
            if (!node.connected) {
                node.warn('Not connected to Ventuz');
                return;
            }
            
            // 构造 OSC 消息
            var oscMsg = {
                address: msg.topic || node.address,
                args: Array.isArray(msg.payload) ? msg.payload : [msg.payload]
            };
            
            // 发送 OSC 消息
            try {
                var osc = require('osc-min');
                var buf = osc.toBuffer(oscMsg);
                node.socket.send(buf, 0, buf.length, node.port, node.host, function(err) {
                    if (err) {
                        node.error('Failed to send OSC message: ' + err.message);
                    } else {
                        node.log('Sent OSC message to ' + node.host + ':' + node.port);
                    }
                });
            } catch (e) {
                node.error('OSC encoding error: ' + e.message);
            }
        });
        
        // 节点状态更新
        node.socket.on('error', function(err) {
            node.error('Socket error: ' + err.message);
            node.connected = false;
            node.status({fill: "red", shape: "ring", text: "error"});
        });
        
        // 标记为已连接
        node.connected = true;
        node.status({fill: "green", shape: "dot", text: "connected"});
        
        // 节点关闭时清理
        node.on('close', function() {
            if (node.socket) {
                node.socket.close();
            }
            node.connected = false;
        });
    }
    
    RED.nodes.registerType("ventuz-broadcast", VentuzBroadcastNode);
};
