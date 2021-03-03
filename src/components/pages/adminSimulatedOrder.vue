<template>
    <div>
        <h2>產品列表</h2>
        <!-- {{rawProducts}} -->
        <!-- {{ filterProductArray }} -->
        <button class="btn btn-info" @click="changePageUnit(2)">
            每頁2個
        </button>
        <button class="btn btn-info" @click="changePageUnit(3)">
            每頁3個
        </button>
        <br>
        <!-- 調整 currentPageNumber -->
        頁數列表
        <ul :value="pageNum" v-for="pageNum in totalPageNumber" :key="pageNum">
            <button @click="updateCurrentPageNumber(pageNum)">
                {{pageNum}}
            </button>
        </ul>

        <!-- 各類別的按鈕 -->
        <section>
            <button class="btn btn-outline-primary mt-3 mr-2" @click="applyCategoryFilter()">
                全部商品
            </button>
            <button class="btn btn-outline-primary mt-3 mr-2" @click="applyCategoryFilter('男士')">
                男士
            </button>
            <button class="btn btn-outline-primary mt-3 mr-2" @click="applyCategoryFilter('女士')">
                女士
            </button>
            <button class="btn btn-outline-primary mt-3 mr-2" @click="applyCategoryFilter('運動')">
                運動
            </button>
            <button class="btn btn-outline-primary mt-3 mr-2" @click="applyCategoryFilter('鞋類')">
                鞋類
            </button>
        </section>

        <!-- <loading :active.sync="isLoading"></loading> -->
        <!-- 金額過濾器 -->
        <div class="row mt-5">
            <div class="col-12">
                {{priceRange[0]}}
                <br>
                {{priceRange[1]}}
                <br>
                <br>
                <br>
                <vue-slider v-model="priceRange" dotSize="28" max="10000" interval="100" :lazy="true"
                    tooltip="always" />
                <button class="btn btn-outline-primary mt-5 mr-2" @click="applyPriceFilter">
                    套用金額範圍
                </button>
            </div>
        </div>

        <div class="row mt-4">
            <!-- <div class="col-md-4 mb-4" v-for="item in products" :key="item.id"> -->

            <!-- <div class="col-md-4 mb-4" v-for="(item, index) in rawProducts" :key="item.id"> -->
            <div class="col-md-4 mb-4" v-for="(item, index) in showProducts" :key="index">

                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center"
                        :style="{backgroundImage:`url(${item.imageUrl})`}">
                        <!-- 這個 div 是拿來放圖片的 -->
                    </div>
                    <div class="card-body">
                        <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                        <h5 class="card-title">
                            <a href="#" class="text-dark">{{ item.title }}</a>
                        </h5>
                        <p class="card-text">{{ item.content }}</p>

                        <div class="d-flex justify-content-between align-items-center"
                            v-if="item.price !== item.origin_price">
                            <del class="h6">
                                原價 ${{ item.origin_price }}
                            </del>
                            <div class="h5" v-if="item.price">現在只要 ${{ item.price }} !</div>
                        </div>
                        <div class="d-flex justify-content-end align-items-center"
                            v-if="item.price === item.origin_price">
                            <div class="h5 text-right">售價 ${{ item.price }}</div>
                        </div>
                    </div>
                    <div class="card-footer d-flex">
                        <button type="button" class="btn btn-outline-secondary btn-sm"
                            @click="getSingleProduct(item.id)">
                            <!-- <i class="fas fa-spinner fa-spin"></i> -->
                            查看更多
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addToCart(item.id)">
                            <!-- 這裡的 addToCart 因為在資料結構中有預設傳入 1 個，所以這邊就不再傳入參數了 -->
                            <!-- <i class="fas fa-spinner fa-spin"></i> -->
                            加到購物車
                        </button>
                    </div>
                </div>

                <!-- 查看更多的modal -->
                <div class="modal fade" id="singleProductModal" tabindex="-1" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">{{ singleProduct.title }}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <!-- <img :src="singleProduct.image" class="img-fluid" alt=""> -->
                                <img :src="singleProduct.imageUrl" class="img-fluid" alt="">
                                <blockquote class="blockquote mt-3">
                                    <p class="mb-0">{{ singleProduct.content }}</p>
                                    <footer class="blockquote-footer text-right">{{ singleProduct.description }}
                                    </footer>
                                </blockquote>

                                <div class="d-flex justify-content-between align-items-center"
                                    v-if="singleProduct.price !== singleProduct.origin_price">
                                    <del class="h6">
                                        原價 ${{ singleProduct.origin_price }}
                                    </del>
                                    <div class="h4" v-if="singleProduct.price">現在只要 ${{ singleProduct.price }} !
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end align-items-center"
                                    v-if="singleProduct.price === singleProduct.origin_price">
                                    <div class="h4 text-right">售價 ${{ singleProduct.price }}</div>
                                </div>

                                <select name="" class="form-control mt-3" v-model="singleProduct.num">
                                    <option :value="num" v-for="num in 10" :key="num">
                                        選購 {{num}} {{singleProduct.unit}}
                                    </option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <div class="text-muted text-nowrap mr-3">
                                    小計 <strong>{{ singleProduct.num * singleProduct.price }}</strong> 元
                                </div>
                                <button type="button" class="btn btn-primary"
                                    @click="addToCart(singleProduct.id, singleProduct.num)">
                                    <!-- <i class="fas fa-spinner fa-spin"
                                        v-if="singleProduct.id === status.loadingItem"></i> -->
                                    加到購物車
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
    </div>
</template>


<style>
    /* 疑問：如果我是寫在 style scoped 中，即使我將樣式加上 !important，仍舊無法覆寫原始樣式，想知道為什麼會這樣~ */
    .vue-slider-process {
        background-color: #ff3368;
    }

    .vue-slider-dot-handle {
        background-color: #ff3368;
    }

    .vue-slider-dot-tooltip-inner {
        border-color: #ff3368;
        background-color: #ff3368;
    }

    .vue-slider-dot-handle-focus {
        -webkit-box-shadow: 0px 0px 1px 2px rgba(255, 51, 104, 0.36);
        box-shadow: 0px 0px 1px 2px rgba(255, 51, 104, 0.36);
    }
</style>
<!-- <style scoped></style> -->


<script>
    import $ from "jquery";

    export default {

        data: function () {
            return {
                rawProducts: [],  // 原始資料
                // allEnabledProducts: [],
                filteredArray: [],  // 渲染頁數前的陣列
                showProducts: [], // 要渲染出來的產品資料

                categoryName: "",         // 用以暫存要過濾出哪個類別的類別名稱
                categoryFilterArray: [],  // 使用 類別過濾器 過濾後的陣列

                priceRange: [0, 10000],   // 用以暫存商品售價範圍
                priceFilterArray: [],     // 使用 金額過濾器 過濾後的陣列

                filterProductArray: [],  // 用以存放 過濾後的產品資料
                singleProduct: {}, // 用以存放 單一產品 modal 的資料

                currentPageNumber: 1,
                totalPageNumber: 1,
                pageUnit: 9, // 每頁顯示幾樣商品，預設是 9

                status: {
                    loadingItem: "", // 判斷正在讀取哪個元素
                },
                // isLoading: false,
                // pagination:"",
            };
        },

        methods: {
            // 因為這到時候是用戶使用的頁面，所以 api 不需要使用 admin

            getRawProducts() {
                // const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`; // 這個成功取回資料
                const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`; // 這個成功取回資料
                // const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`; // 這個無法取回資料
                const vm = this;

                // vm.isLoading = true; // 讀取效果

                // 從遠端取回 產品 、 分頁 的資料
                this.$http.get(api).then((response) => {
                    console.log(response); // 確認遠端撈回來的資料結構
                    vm.rawProducts = response.data.products;
                    // vm.isLoading = false;  // 讀取效果
                    vm.getCategoryFilterArray();
                    vm.getPriceFilterArray();
                    vm.saveFilteredArray();
                    vm.makeShowProducts();
                    // vm.categoryFilter(vm.categoryName); // 套用類別篩選器 // router 轉進來會用到，不能刪
                });

            },

            // 類別過濾器
            getCategoryFilterArray(str = "") {
                const vm = this;
                vm.categoryName = str;
                vm.categoryFilterArray = []; // 先將原本的陣列清空。 // 如果沒有加這行，符合篩選條件的內容就就會一直疊加到舊的陣列中

                let arr = vm.rawProducts.filter(function (item) {
                    // 如果是預設，則回傳有啟用的商品
                    if (vm.categoryName === "") {
                        return item.is_enabled === 1; // 如果商品有啟用，則顯示
                        // return true; // 如果想要全部回傳，那就可以這樣寫 
                        // 原理：filter() 會回傳一個陣列，如果 return 後方的條件判斷後為 true ，則回傳該物件
                    }
                    // 如果有套用篩選器，則回傳符合篩選條件，且有啟用的商品
                    else {
                        if (item.category === vm.categoryName) {
                            return item.is_enabled === 1;
                        }
                    }
                });
                vm.categoryFilterArray = arr; // filterProductArray 使用 類別過濾器 過濾後的陣列
            },
            applyCategoryFilter(str = "") {
                this.getCategoryFilterArray(str);
                this.saveFilteredArray();
                this.updateCurrentPageNumber(1); // this.makeShowProducts(); 在 this.updateCurrentPageNumber() 函式中就會執行了
            },

            // 金額過濾器
            getPriceFilterArray() {
                const vm = this;
                vm.priceFilterArray = []; // 先將原本的陣列清空。 // 如果沒有加這行，符合篩選條件的內容就就會一直疊加到舊的陣列中
                let arr = vm.rawProducts.filter(function (item) {
                    if (item.price >= vm.priceRange[0] && item.price <= vm.priceRange[1]) {
                        return item.is_enabled === 1; // 如果商品有啟用，則顯示
                    }
                });
                vm.priceFilterArray = arr; // filterProductArray 使用 金額過濾器 過濾後的陣列
                console.log("vm.priceFilterArray", vm.priceFilterArray);
            },
            applyPriceFilter() {
                this.getPriceFilterArray();
                this.saveFilteredArray();
                this.updateCurrentPageNumber(1);
            },

            // 同時套用過濾器 金額 類別
            // 這個寫出來的話，傳遞參數時好像會出問題，所以就暫時先略過


            // 取 categoryFilterArray、priceFilterArray 的交集
            saveFilteredArray() {
                const vm = this;
                vm.filteredArray = []; // 先將原本的陣列清空。 // 如果沒有加這行，符合篩選條件的內容就就會一直疊加到舊的陣列中
                for (let i = 0; i < vm.categoryFilterArray.length; i++) {
                    for (let j = 0; j < vm.priceFilterArray.length; j++) {
                        if (vm.categoryFilterArray[i].id === vm.priceFilterArray[j].id) {
                            vm.filteredArray.push(vm.categoryFilterArray[i]);
                        }
                    }
                }
            },

            // 製作要渲染的產品 array 
            makeShowProducts() {
                const vm = this;
                vm.totalPageNumber = Math.ceil(vm.filteredArray.length / vm.pageUnit); // 計算總共有幾頁，並存入 data return 中

                // 製作要顯示的分頁項目內容陣列 
                let finalArr = vm.filteredArray.filter(function (item, index) {
                    if (index >= (vm.currentPageNumber - 1) * vm.pageUnit && vm.currentPageNumber * vm.pageUnit - 1 >= index) {
                        return true;
                    }
                });
                vm.showProducts = finalArr; // 將符合條件的項目存入 data return 中
            },

            // 調整每頁顯示的商品數量
            changePageUnit(unit = 9) {
                this.pageUnit = unit; // 將調整後的每頁顯示數量存入 data return 中
                this.updateCurrentPageNumber(1); // 讓重新渲染後的頁面保持在第一頁
                // this.makeShowProducts(); // 重新渲染產品項目 // this.makeShowProducts(); 在 this.updateCurrentPageNumber() 函式中就會執行了
            },

            // 切換頁數使用 並 重新渲染商品頁面
            updateCurrentPageNumber(nowNumber) {
                this.currentPageNumber = nowNumber;
                this.makeShowProducts();
            },

            getSingleProduct(id) {
                const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
                const vm = this;

                // 讀取效果
                // vm.isLoading = true;
                // vm.status.loadingItem = id;
                // 從遠端取回 產品 、 分頁 的資料
                this.$http.get(api).then((response) => {
                    // console.log(response); // 確認遠端撈回來的資料結構
                    vm.singleProduct = response.data.product; // 取回單一產品的資料
                    $("#singleProductModal").modal("show"); // 顯示 modal
                    // vm.pagination = response.data.pagination;
                    // vm.isLoading = false;
                    // vm.status.loadingItem = "";

                });
            },

            // 將商品加入購物車
            addToCart(id, qty = 1) {
                const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
                const vm = this;
                // vm.status.loadingItem = id;
                const cart = {
                    product_id: id,
                    qty,
                    // 也可以這樣寫
                    // qty:qty;
                };
                this.$http.post(api, { data: cart }).then((response) => {
                    console.log(response);
                    // vm.status.loadingItem = '';
                    // vm.getCart();
                    $('#singleProductModal').modal('hide');
                });
            },

            // 取得購物車內容
            getCart() {
                const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
                const vm = this;
                // vm.isLoading = true;
                this.$http.get(api).then((response) => {
                    console.log(response); // 確認從遠端撈回來的資料結構
                    console.log("response.data.data.carts", response.data.data.carts); // 確認從遠端撈回來的資料結構
                    // vm.isLoading = false;
                });
            },



        },


        created() {
            this.categoryName = this.$route.query.category; // 將路由傳入的參數存入 data return 中
            // 取得原始資料
            this.getRawProducts();
            // 套用類別篩選器
            // this.categoryFilter();
            // 套用金額篩選器
            // this.priceFilter();
            // 取交集
            // this.saveFilteredArray();
            // 渲染
            // this.makeShowProducts();
        },
    };
</script>