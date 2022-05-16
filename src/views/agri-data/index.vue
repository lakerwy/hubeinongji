<template>

    <div class="cont">
        <div class="nav">
            <div class="nav-item" v-for="(item,index) in navList" :key="item.id" @click="changeNav(item,index)">
                <img :src="navIndex == index?'img/nav_hover.png':'img/nav.png'" alt="">
                <span :style="{color: navIndex == index?'#76ffed':'#9fd3ff'}">
                    {{ item.value }}
                </span>
            </div>
        </div>
        <router-view></router-view>
        <!--<Footer/>-->
    </div>
</template>

<script>
    import Footer from '@/components/footer/index'
    import {mapGetters} from 'vuex'

    export default {
        components: {
            Footer
        },
        data() {
            return {
                navList: [
                ],
                navIndex: sessionStorage.getItem('agriMavIndex') ? sessionStorage.getItem('agriMavIndex') : 0,
            }
        },
        computed: {
            ...mapGetters(['permissions'])
        },
        created() {
            this.initNav()
        },
        destroyed() {
            sessionStorage.setItem('agriMavIndex', 0)
        },
        methods: {
            changeNav(item, index) {
                this.navIndex = index;
                sessionStorage.setItem('agriMavIndex', this.navIndex)
                this.$router.push({path: item.path})
            },
            initNav() {
                //console.log("this.permissions", this.permissions)

                let i = 1
                if (this.permissions[window.global.buttonPremission.agriDataMachine]) {
                    this.navList.push({id: i, value: '农机  统计', path: '/agri-data/farmStatis/index'})
                    i++;
                }
                if (this.permissions[window.global.buttonPremission.agriDataWork]) {
                    this.navList.push({id: i, value: '作业  统计', path: '/agri-data/workStatis/index'})
                    i++
                }
                if (this.permissions[window.global.buttonPremission.agriDataMap]) {
                    this.navList.push({id: i, value: '农机  一张图', path: '/agri-data/onemap/index'})
                    i++
                }
                if (this.navList.length > 0) {
                    this.changeNav(this.navList[0], 0);
                }
            },

        }

    }
</script>

<style lang="less" scoped>
    @vw: 19.2vw;
    @vh: 10.8vh;
    @Font-size: 14 / @vw;
    .containerRoute2 > .cont {
        // height: calc(100vh - 69px);
        // min-height: 780px;
        // min-width: 1500px;
        background: url("../../assets/images/bg.png");
        background-size: 100% 100%;
        position: relative;
        overflow: hidden;
    }

    @media screen and (max-width:1800px) {
        .nav{
            width: 420px !important;
            position: absolute;
            bottom: 40 / @vh !important;
            .nav-item{
                span{
                    font-size: 14px !important;
                    width: 42px !important;
                }
            }
        }
    }

    .nav {
        z-index: 20;
        position: absolute;
        bottom: 60 / @vh;

        // pbw修改样式
        left: 50%;
        transform: translate(-50%,0);
        // 修改

        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;

        .nav-item {
            position: relative;
            padding: 0 20px 0 20px;
            cursor: pointer;
            width: 30%;

            img{
                width: 100%;
            }
            
            span {
                position: absolute;
                top: 40%;
                left: 50%;
                transform: translate(-50%,-50%);
                display: inline-block;
                width: 3 * @Font-size;
                font-size: @Font-size;
                text-align: center;
                color: #9fd3ff;
            }
        }
    }

</style>