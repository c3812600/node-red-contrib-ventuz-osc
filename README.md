# node-red-contrib-ventuz-osc

Node-RED 节点，用于 Ventuz OSC 通信。

## 功能

- **ventuz-broadcast**: 向 Ventuz 广播 OSC 消息
- **ventuz-subscribe**: 订阅 Ventuz 广播的 OSC 消息

## 安装

```bash
cd ~/.node-red
npm install ~/Desktop/Claude/node-red-ventuz-osc
```

或通过 Node-RED 管理面板安装。

## 配置

### ventuz-broadcast 节点

- **host**: Ventuz 主机地址
- **port**: OSC 端口号
- **address**: OSC 地址（如 `/ventuz/broadcast`）

### ventuz-subscribe 节点

- **port**: 监听端口号
- **address**: OSC 地址过滤器

## 示例

导入 `examples/` 目录中的示例流程。

## 依赖

- [osc-min](https://github.com/auditormedia/osc-min) - OSC 消息处理

## License

MIT
