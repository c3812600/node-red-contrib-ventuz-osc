/**
 * Ventuz Subscribe Node
 * 订阅 Ventuz 广播的 OSC 消息
 */

module.exports = function(RED) {
    function VentuzSubscribeNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        // 配置
        node.port = parseInt(config.port) || 9001;
        node.address = config.address || '/ventuz/*';
        
        // 状态
        node.listening = false;
        
        // 初始化 UDP socket
        var dgram = require('dgram');
        node.socket = dgram.createSocket('udp4');
        
        // 绑定端口监听
        node.socket.bind(node.port, function() {
            node.listening = true;
            node.log('Listening for OSC messages on port ' + node.port);
            node.status({fill: "green", shape: "dot", text: "listening"});
        });
        
        // 接收 OSC 消息
        node.socket.on('message', function(msg, rinfo) {
            try {
                var osc = require('osc-min');
                var oscMsg = osc.fromBuffer(msg);
                
                // 地址过滤
                var addressPattern = node.address;
                if (addressPattern !== '*' && addressPattern !== '/ventuz/*') {
                    var regex = new RegExp('^' + addressPattern.replace(/\*/g, '.*') + '$');
                    if (!regex.test(oscMsg.address)) {
                        return; // 不匹配则忽略
                    }
                }
                
                // 输出消息
                node.send({
                    topic: oscMsg.address,
                    payload: oscMsg.args,
                    _raw: msg
                });
                
            } catch (e) {
                node.error('OSC decoding error: ' + e.message);
            }
        });
        
        // 错误处理
        node.socket.on('error', function(err) {
            node.error('Socket error: ' + err.message);
            node.listening = false;
            node.status({fill: "red", shape: "ring", text: "error"});
        });
        
        // 节点关闭时清理
        node.on('close', function() {
            if (node.socket) {
                node.socket.close();
            }
            node.listening = false;
        });
    }
    
    RED.nodes.registerType("ventuz-subscribe", VentuzSubscribeNode);
};
