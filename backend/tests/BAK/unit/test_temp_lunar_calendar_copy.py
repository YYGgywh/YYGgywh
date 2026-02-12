# 测试lunar-python库的Solar.fromBaZi四柱转换功能

from lunar_python import Solar, Lunar

lunar_date = Lunar.fromYmdHms(2025, 2, 15, 0, 0, 0)

# 将方法链结果赋值给变量，然后打印输出变量
prev_jie_time = lunar_date.getPrevJie().getSolar().toYmdHms()
prev_jie_name = lunar_date.getPrevJie().getName()
next_jie_time = lunar_date.getNextJie().getSolar().toYmdHms()
next_jie_name = lunar_date.getNextJie().getName()
prev_qi_time = lunar_date.getPrevQi().getSolar().toYmdHms()
prev_qi_name = lunar_date.getPrevQi().getName()
next_qi_time = lunar_date.getNextQi().getSolar().toYmdHms()
next_qi_name = lunar_date.getNextQi().getName()

prev_jie_solar = lunar_date.getPrevJie().getSolar()
prev_qi_solar = lunar_date.getPrevQi().getSolar()

jieqi_result_a = {}

if prev_jie_solar.isBefore(prev_qi_solar):
    jieqi_result_a = {
        "prev_jie": {
            "name":prev_jie_name,
            "time":prev_jie_time
        },
        "prev_qi":{
            "name":prev_qi_name,
            "time":prev_qi_time
        },
        "next_jie":{
            "name":next_jie_name,
            "time":next_jie_time
        }
    }
    print("时间顺序：节 → 气 → 下一个节")
else:
    jieqi_result_a = {
        "prev_jie": {
            "name":prev_jie_name,
            "time":prev_jie_time
        },
        "next_qi":{
            "name":next_qi_name,
            "time":next_qi_time
        },
        "next_jie":{
            "name":next_jie_name,
            "time":next_jie_time
        }
    }
print(lunar_date.getSolar().toYmdHms())
print("\n")
print("按时间顺序排列的节气字典：", jieqi_result_a)
