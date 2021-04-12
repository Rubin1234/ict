<% data.product.forEach(function(data1){ %>
    <div id="<%= data1.slug %>" class="modal fade" role="dialog">
        <div class="modal-dialog" style="margin: 5% auto;min-height: 300px;padding: 20px;max-width: 870px;">
          <!-- Modal Content Strat-->
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <div class="modal-details">
                 <div class="row">
                     <!--Product Img Strat-->
                     <div class="col-xl-5 col-lg-5">
                         <!--Product Tab Content Start-->
                          <div class="tab-content">
                              
                              <div id="<%= data1.product_name %>11" class="tab-pane fade show active">
                                  <div class="modal-img img-full">
                                      <img src="images/backend/products/<%= data1.product_image %>" alt="">
                                  </div>
                              </div>
                              <% data1.images.forEach(function(productImages,key){ %>
                                <div id="<%= data1.product_name %><%= key %>" class="tab-pane">
                                    <div class="modal-img img-full">
                                        <img src="images/backend/products/product_images/<%= productImages.productImage %>" alt="">
                                    </div>
                                </div>
                              <% }) %>
                            
                        
                          </div>
                          <!--Product Tab Content End-->
                          <!--Single Product Tab Menu Start-->
                          <div class="modal-product-tab">
                              <ul class="nav">
                                  <li><a class="active" data-toggle="tab" href="#<%= data1.product_name %>11"><img src="images/backend/products/<%= data1.product_image %>" alt=""></a></li>
                                  
                                  <%  %>
                                  <% data1.images.forEach(function(productImages,key){ %>
                                        <li><a data-toggle="tab" href="#<%= data1.product_name %><%= key %>"><img src="images/backend/products/product_images/<%= productImages.productImage %>" alt=""></a></li>
                                  <% }) %>
                                 
                              </ul>
                          </div>
                          <!--Single Product Tab Menu Start-->
                     </div> 
                     <!--Product Img End-->
                     <!-- Product Content Start-->
                     <div class="col-xl-7 col-lg-7">
                         <div class="product-info">
                             <h2><%= data1.product_name %></h2>
                             <div class="product-price">
                                 <span class="old-price">$74.00</span>
                                 <span class="new-price">$69.00</span>
                             </div>
                        
                           <div class="row quickviewsize">
                            <div class="col-md-3" style="padding: 0px;"> <h4>Size:</h1></div>
                                <div class="col-md-9"  style="padding: 0px;">
                                   <span>XXL</span></a>
                                    <span>XL</span>
                                    <span>L</span>
                                    <span>M</span>
                                    <span>S</span>
                                    </div>
                           </div>
                           <div class="row quickviewcolor">
                               <div class="col-md-3" style="padding: 0px;"> <h4>Available Color:</h1></div>
                                <div class="col-md-9"  style="padding: 0px;">
                                    <span>Red</span>
                                
                                    <span>Black</span>
                                    <span>Green</span>
                                    <span>White</span>
                                    <span>Orange</span>
                                    <span>Crimson</span>
                                </div>
                            
                      
                    </div>
                             <div class="add-to-cart quantity">
                                  <form class="add-quantity" action="#">
                                       <div class="quantity modal-quantity">
                                           <label>Quantity</label>
                                           <input type="number">
                                       </div>
                                      <div class="add-to-link">
                                          <button class="form-button" data-text="add to cart">add to cart</button>
                                      </div>
                                  </form>
                             </div>
                             <% if(data1.product_description.length>0){ %>
                             <div class="cart-description">
                               <p><%- data1.product_description.substring(0,200) %><a href="" style="color: white;
                                background: orange;
                                padding: 4px 9px;
                                display: inline-block;
                                margin-top: 10px;">View more</a></p>
                               
                             </div>
                             <% }else{ %>
                                <h4>Sorry, No Description Provided</h4>
                            <% } %>
                             <div class="social-share">
                                 <h3>Share this product</h3>
                                 <ul class="socil-icon2">
                                     <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                                     <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                                     <li><a href="#"><i class="fa fa-pinterest"></i></a></li>
                                     <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
                                     <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
                                 </ul>
                             </div>
                         </div>
                     </div>
                     <!--Product Content End--> 
                 </div> 
              </div>
            </div>
          </div>
          <!--Modal Content Strat-->
        </div>
      </div>
      <% })  %>
<% })  %>