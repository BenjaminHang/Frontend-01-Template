### 五子棋策略

1. 减少递归

|||||||||||||
|-|-|-|-|-|-|-|-|-|-|-|-|
|1.| | | | |o|
| |o|⚫️|⚫️|⚫️|o|
| | | |⚫️| |
| | |⚫️| | | 
| |o| | | |
|2.| | | | |o|
| |o|⚪|⚪|⚪|o|
| | | |⚪| |
| | |⚪| | | 
| |o| | | |
|3.|o|⚫️|⚫️|⚫️|⚫️|o|
|4.|o|⚪|⚪|⚪|⚪|o|
|5.|⚫️|⚫️|⚫️|⚫️|⚫️|
|6.|⚪|⚪|⚪|⚪|⚪|

其他情况
1. 连成4个的且能连成5个的，连成3个且能连成5个的，连成2个且能连成5个的，其他就随便下

2. 缩小区域
    1. 有子区域 -2 ～ +2
    2. 第一步（无子）落在正中间

有时间再整理整理，写个5子棋的。