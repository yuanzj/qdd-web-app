<template>
  <div class="lm-font-default lm-text-text">
    <h3>雷小电智能锂电使用须知：</h3>
    <p>
    1. 车辆改装线路时，避免线路存在锂电池和车内其他电池同时使用的场景。<br>
    2. APP显示电量为0%后，请提示用户马上充电，不能再进行长距离骑行或者长时间搁置。
    </p>
    <h3>业务答疑FAQ</h3>

    <div>
      <p class="lm-text-green">
        问：电池逾期后还能使用吗？
      </p>
      <p>
        答：逾期后电池将在凌晨6点自动关闭。届时，电池不能使用，不能充电。但计费系统仍然在计算租金。
      </p>
    </div>

    <div>
      <p class="lm-text-green">
        问：电池逾期了，续费后租期是以新续费时间进行计算的吗？
      </p>
      <p>
        答：电池逾期后再进行续租的话，时间是以到期时间进行更新计算。
      </p>
    </div>

    <div>
      <p class="lm-text-green">
        问：电池逾期了，此时退租会扣除逾期费用吗
      </p>
      <p>
        答：电池逾期后退租，系统将以天（24小时）为单位进行扣费，不满1天（24小时）将不计算费用。
      </p>
    </div>

    <div>
      <p class="lm-text-green">
        问：电池逾期被关闭后，也续费了，为啥电池还是不能使用。
      </p>
      <p>
        答：<br>
        1. 电池续费时，电池请勿接在车上，续费成功后，电池会自动开启，通过app确认电池开启后，才可将电池接上车辆。<br>
        2. 如果续费时电池是接在车辆上的，请拔出电池转换线，通过APP来切换一次电池的开关状态，然后再接上车辆使用。<br>
        3. 如果电池还是无法使用，请插上充电器进行充电激活，充电器红灯亮则代表激活成功，电池可正常使用。
      </p>
    </div>

    <h3>电池异常快速检测FAQ</h3>
    <div>
      <p class="lm-text-green">
        问：在租期内，为啥电池不能使用或者不能充电。
      </p>
      <p>
        答：<br>
        以下操作，请在用户还未更换电池前进行操作。或者联系雷小电技术进行联合操作。<br>
        1.打开APP，查看电池是否是使用状态，请保证电池处于使用状态。<br>
        2.在电池是使用状态下，插上充电器，观察是否可以充电（红灯），如果不可充电，请检测电池保险丝是否熔断。如果未熔断的话请售后维修。<br>
        3.如果保险丝熔断，请更换保险丝，然后进行充电。如果不可充电请售后维修。<br>
        4.如果可充电，则使用APP断开电池输出，观察是否可以继续充电，如果可以充电，请售后维修。
      </p>
    </div>

    <div>
      <p class="lm-text-green">问：电池离线是什么情况</p>
      <p>答：请将电池至于室外有手机信号处大约5分钟进行观察，如果仍然离线，则需售后维修。</p>
    </div>

    <div>
      <p class="lm-text-green">问：用户反馈电池里程短。</p>
      <p>答：给用户更换电池。同时该电池序号予以记录，使用商家版解除售后标识，可再次租给其他骑手或者自己试骑（自己试骑时，可联系雷小电技术进行配合），如果确认电池里程异常，则进行售后维修。</p>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'OpsHelp',
    mounted () {
      document.title = '帮助'
    }
  }
</script>

<style scoped>

  h3{
    padding: 1rem;
    font-size: 1.5rem;
  }

  p{
    padding: 0.5rem 1rem 0.5rem 1rem;
  }

</style>
