window.globalUrl = {
    HOME_API: '/', // api后缀要带 /
}


window.global = {
    view: {
        zoom: 7.5,
        center: [112.23180806, 31.03476383]
    },
    layers: [
        // {
        //   name: "矢量",
        //   icon: "",
        //   data: [
        //     {
        //       type: "xyz",
        //       url:
        //         "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
        //       projection: "EPSG:3857"
        //     },
        //     {
        //       type: "xyz",
        //       url:
        //         "http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
        //       projection: "EPSG:3857"
        //     }
        //   ]
        // },
        {
            name: "栅格",
            icon: "",
            data: [
                {
                    type: "xyz",
                    url:
                        "http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=c96efe76d453095433f941beb574e921 ",
                    projection: "EPSG:3857",
                    crossOrigin:"Anonymous",
                },
                {
                    type: "xyz",
                    url:
                        "http://t{0-7}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=c96efe76d453095433f941beb574e921 ",
                    projection: "EPSG:3857",
                    crossOrigin:"Anonymous",

                }
            ]
        }
    ],
    xzqh: {
        type: "arcgis",
        url:
            "/arcgis/rest/services/nongjiProject/boundary/MapServer",
        sheng: 0,
        shi: 1,
        xian: 2,
        adcode: "adcode",
    },
    areaLayer: {
        type: "geoserver",
        url: "http://223.75.53.178:8884/geoserver/agri_420000/wms",
        layers: "agri_420000:agri_420000_area_2021",
        projection: "EPSG:900913",
        tiled: true,
    },
    areaLayer2: {
        url: 'http://223.75.53.178:8884/geoserver/agri_420000/wms',
        params: {
            FORMAT: 'image/png',
            VERSION: '1.1.1',
            tiled: true,
            LAYERS: 'agri_420000:agri_420000_area_2021',//tiger--图层的名称空间&#xff0c;poi--图层名称
            exceptions: 'application/vnd.ogc.se_inimage',
        },
        serverType: 'geoserver',//服务类型geoerver
        crossOrigin: 'anonymous',
        index: 1
    },
    //按钮权限
    buttonPremission: {
        /*------------------农机大数据----------*/
        agriDataMachine: 'agri:data:machine', //农机统计
        agriDataWork: 'agri:data:work', //作业统计
        agriDataMap: 'agri:data:map', //一张图

        /*------------------作业监控----------*/
        monitorHistory: 'agri:monitoring:history', //历史轨迹
        monitorRealtime: 'agri:monitoring:realtime', //实时监控
        monitorWorkView: 'agri:monitoring:workview', //作业查询
        monitorView: 'agri:monitoring:view', //查询

        /*------------------作业管理----------*/
        workMonitor: 'agri:work:monitor', //作业监控
        workRepeatAudit: 'agri:work:repeatAudit', //重复作业审核
        // 作业审核
        jobAuditMap: 'at:jobAudit:map', //审核切换地图
        jobView: 'at:job:view', //查询
        workRepeat: 'agri:work:repeat', //重复作业
        jobEdit: 'at:job:edit', //修改
        jobExport: 'at:job:export', //导出
        jobAppearadd: 'at:job:appearadd', //作业上报
        jobAppeardepthadd: 'at:job:appeardepthadd', //深度上报
        jobAdd: 'at:job:add', //补报
        jobCheck: 'at:job:check', //审核
        jobDelete: 'at:job:delete', //删除
        jobUpdateAlot: 'at:job:UpdateAlot', //批量修改
        jobAutoAudit: 'agri:repeatWork:autoAudit',
        /*--------------------报表分析----------*/
        /*作业分析报表*/
        //数据分析报表-任务完成情况
        taskCompleteView: 'rp:TaskComplete:view', //查询
        taskCompleteExport: 'rp:TaskComplete:export', //导出
        //数据分析报表-区域大数据报表
        regionBigDateView: 'rp:regionBigDate:view', //查询
        regionBigDateExport: 'rp:regionBigDate:export', //导出
        // 数据分析报表-作业日查询报表
        jobDayQueryReportView: 'rp:jobDayQuery:view', //查询
        jobDayQueryReportExport: 'rp:jobDayQuery:export', //导出
        // 数据分析报表-农机月上线统计报表
        agriMonthOnlineReportView: 'rp:agriMonthOnline:view', //查询
        agriMonthOnlineReportExport: 'rp:agriMonthOnline:export', //导出
        //数据分析报表-监测面积统计报表
        detectionAreaReportView: 'rp:detectionArea:view', //查询
        detectionAreaReportExport: 'rp:detectionArea:export', //导出
        //数据分析报表-农机终端面积统计报表
        agriMachineTerminalReportView: 'rp:agriMachineTerminal:view', //查询
        agriMachineTerminalReportExport: 'rp:agriMachineTerminal:export', //导出
        /*作业明细报表*/
        //作业报表-作业汇总报表
        jobSummaryView: 'rp:JobSummary:view', //查询
        jobSummaryExport: 'rp:JobSummary:export', //导出
        //作业报表-农机作业明细报表
        driverJobDetailReportView: 'rp:DriverJobDetailReport:view', //查询
        driverJobDetailReportExport: 'rp:DriverJobDetailReport:export', //导出
        //作业报表-农机作业类型统计报表
        agriWorkTypeReportView: 'rp:agriWorkType:view', //查询
        agriWorkTypeReportExport: 'rp:agriWorkType:export', //导出
        //作业报表-合作社作业总报表
        cooperatWorkSumReportView: 'rp:cooperatWorkSum:view', //查询
        cooperatWorkSumReportExport: 'rp:cooperatWorkSum:export', //导出
        //作业报表-合作社农机作业明细表
        cooperatAgriReportView: 'rp:cooperatAgri:view', //查询
        cooperatAgriReportExport: 'rp:cooperatAgri:export', //导出
        /*作业补助报表*/
        //补助报表-补助资金明细报表
        assisDetailView: 'rp:AssisDetail:view', //查询
        assisDetailExport: 'rp:AssisDetail:export', //导出
        //补助报表-补助情况汇总报
        assisSummaryView: 'rp:AssisSummary:view', //查询
        assisSummaryExport: 'rp:AssisSummary:export', //导出
        // 补助报表-作业补贴汇总报
        jobAssistanceSituationSummaryView: 'rp:jobAssistanceSituationSummary:view', //查询
        jobAssistanceSituationSummaryExport: 'rp:jobAssistanceSituationSummary:export', //导出
        /*农机报警统计*/
        //农机报警统计报表-重复作业告警报
        repeatWorkAlarmView: 'rp:repeatWorkAlarm:view', //查询
        repeatWorkAlarmExport: 'rp:repeatWorkAlarm:export', //导出
        //农机报警统计报表-边界告警报表
        boundaryAlarmView: 'rp:boundaryAlarm:view', //查询
        boundaryAlarmExport: 'rp:boundaryAlarm:export', //新增
        /*系统信息统计*/
        //信息查询报表-服务到期提醒报表
        serviceOverView: 'rp:ServiceOver:view', //查询
        serviceOverExport: 'rp:ServiceOver:export', //导出
        serviceOverRenew: 'rp:ServiceOver:renew', //续约
        //信息查询报表-用户登录情况报表
        userLoginView: 'rp:UserLogin:view', //查询
        userLoginExport: 'rp:UserLogin:export', //导出
        //信息查询报表-操作日志查询报表
        operLogView: 'rp:operLog:view', //查询
        operLogExport: 'rp:operLog:export', //导出

        /*------------------基础信息-----------*/
        //基础信息-安装审核
        installView: 'cd:install:view', //查询
        installAudit: 'cd:install:audit', //审核
        installDetails: 'cd:install:details', //详情
        installDelete: 'cd:install:delete', //删除
        installExport: 'cd:install:export', //导出
        //基础信息-农机信息
        machineAdd: 'cd:machine:add', //新增
        machineView: 'cd:machine:view',  //查询
        machineEdit: 'cd:machine:edit',  //修改
        machineChangetemial: 'cd:machine:changetemial', //更换终端
        machineDelete: 'cd:machine:delete', //删除
        machineImport: 'cd:machine:import', //导入
        machineExport: 'cd:machine:export', //导出
        machineHistory: 'cd:machine:history', //历史查询
        machineOpencompute: 'cd:machine:opencompute', //开启面积计算
        machineClosecompute: 'cd:machine:closecompute', //关闭面积计算
        machineActivate: 'cd:machine:activate', //激活
        machineUneffect: 'cd:machine:uneffect', //失效
        machineOpenpush: 'cd:machine:openpush', //开启消息推送
        machineClosepush: 'cd:machine:closepush', //关闭消息推送
        machineInstallsheet: 'cd:machine:Installsheet', //电子安装单
        //基础信息-终端信息
        terminalView: 'cd:terminal:view', //查询
        terminalAdd: 'cd:terminal:add', //新增
        terminalEdit: 'cd:terminal:edit', //修改
        terminalExport: 'cd:terminal:export', //导出
        terminalHistory: 'cd:terminal:history', //历史查询
        terminalDelete: 'cd:terminal:delete', //删除
        terminalTerminalModel: 'cd:terminal:terminalModel', //显示真实终端型号
        //基础信息-机具信息
        toolView: 'cd:tool:view', //查询
        toolAdd: 'cd:tool:add', //新增
        toolEdit: 'cd:tool:edit', //修改
        toolImport: 'cd:tool:import', //导入
        toolExport: 'cd:tool:export', //导出
        toolDelete: 'cd:tool:delete', //删除
        //基础信息-生产资源管理
        productResourcesView: 'cd:productResources:view', //查询
        productResourcesAdd: 'cd:productResources:add', //新增
        productResourcesDelete: 'cd:productResources:delete', //删除
        productResourcesEdit: 'cd:productResources:edit', //修改
        productResourcesImport: 'cd:productResources:import', //导入
        productResourcesExport: 'cd:productResources:export', //导出
        productResourceMap: 'cd:resource:map', //地图
        /*------------------系统管理---------*/
        //权限管理-用户管理
        userView: 'sm:user:view', //查询
        userAdd: 'sm:user:add', //新增
        userEdit: 'sm:user:edit', //修改
        userDelete: 'sm:user:delete', //删除
        userImport: 'sm:user:import', //批量导入
        userReset: 'sm:user:reset', //重置密码
        userMag: 'sm:user:mag', //管理范围
        userExport: 'sm:user:export', //导出
        //权限管理-角色管理
        roleView: 'sm:role:view', //查询
        roleAdd: 'sm:role:add', //新增
        roleEdit: 'sm:role:edit', //修改
        roleDelete: 'sm:role:delete', //删除
        rolePerm: 'sm:role:perm', //权限
        //权限管理-分组管理
        groupView: 'sm:group:view', //查询
        groupAdd: 'sm:group:add', //新增
        groupEdit: 'sm:group:edit', //修改
        groupDelete: 'sm:group:delete', //删除
        groupTranser: 'sm:group:transer', //迁移分组
        groupImport: 'sm:group:import', //批量导入
        groupAddChildren: 'sm:group:add', //新增子项
        //权限管理-菜单管理
        menuView: 'sm:menu:view', //查询
        menuAdd: 'sm:menu:add', //新增
        menuEdit: 'sm:menu:edit', //修改
        menuDelete: 'sm:menu:delete', //删除
        //平台配置-作业季管理
        jobseasonView: 'sm:jobseason:view', //查询
        jobseasonAdd: 'sm:jobseason:add', //新增
        jobseasonEdit: 'sm:jobseason:edit', //修改
        jobseasonDelete: 'sm:jobseason:delete', //删除
        //平台配置-任务管理
        taskView: 'sm:task:view', //查询
        taskAdd: 'sm:task:add', //新增
        taskEdit: 'sm:task:edit', //编辑
        taskDelete: 'sm:task:delete', //删除
        //平台配置-审核标准
        auditStandardView: 'sm:auditStandard:view', //查询
        auditStandardAdd: 'sm:auditStandard:add', //新增
        auditStandardEdit: 'sm:auditStandard:edit', //修改
        auditStandardDelete: 'sm:auditStandard:delete', //删除
        //平台配置-算法配置
        algorithmView: 'sm:algorithm:view', //查询
        algorithmAdd: 'sm:algorithm:add', //新增
        algorithmEdit: 'sm:algorithm:edit', //修改
        algorithmDelete: 'sm:algorithm:delete', //删除
        //平台配置-通讯协议管理
        protocolView: 'sm:protocol:view', //查询
        protocolAdd: 'sm:protocol:add', //新增
        protocolEdit: 'sm:protocol:edit', //修改
        protocolDelete: 'sm:protocol:delete', //删除
        //系统设置-字典管理
        dictView: 'sm:dict:view', //查询
        dictAdd: 'sm:dict:add', //新增
        dictEdit: 'sm:dict:edit', //修改
        dictDelete: 'sm:dict:delete', //删除
        //系统设置-农机机具作业配置
        jobtypeView: 'sm:jobtype:view', //查询
        jobtypeAdd: 'sm:jobtype:add', //新增
        jobtypeExport: 'sm:jobtype:export', //导出
        jobtypeEdit: 'sm:jobtype:edit', //编辑
        jobtypeDelete: 'sm:jobtype:delete', //删除
        //运维资料管理
        operationdataView: 'sm:operationdata:view', //查询
        operationdataAdd: 'sm:operationdata:add', //新增
        operationdataEdit: 'sm:operationdata:edit', //编辑
        operationdataDelete: 'sm:operationdata:delete', //删除
        operationdataExport: 'sm:operationdata:export', //导出

    }
};