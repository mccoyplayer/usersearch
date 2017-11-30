$(document).ready(function () {
   'use strict';

   /*
      Thanks to brad-christie for such a wonderful
      Script to detect whether the user is typing
      or not

      https://github.com/brad-christie
   */

   (function ($) {
      $.fn.extend({
         doneTyping: function (callback, timeout) {
            timeout = timeout || 1e3;
            var timeoutReference,
               doneTyping = function (el) {
                  if (!timeoutReference) return;
                  timeoutReference = null;
                  callback.call(el);
               };
            return this.each(function (i, el) {
               var $el = $(el);
               $el.is(':input') && $el.on('keyup keypress paste', function (e) {
                  if (e.type === 'keyup' && e.keyCode !== 8) return;

                  if (timeoutReference) clearTimeout(timeoutReference);
                  timeoutReference = setTimeout(function () {
                     doneTyping(el);
                  }, timeout);
               }).on('blur', function () {
                  doneTyping(el);
               });
            });
         }
      });
   }(jQuery));

   /*
      Stop form from submitting if enter button is pressed.
   */

   $('#get-user-form').on('submit', function (e) {
      e.preventDefault();
   });

   $('#username').doneTyping(function () {
      var name = $('#username').val(),
         requri = 'https://api.github.com/users/' + encodeURIComponent(name),
         repouri = 'https://api.github.com/users/' + encodeURIComponent(name) + '/repos';

      $.ajax({
         url: requri,
         dataType: "json",
         success: function (data) {

            // else we have a user and we display their info
            var name = data.name,
               username = data.login,
               profilepic = data.avatar_url,
               html_url = data.html_url,
               location = data.location,
               followers = data.followers,
               following = data.following,
               repos = data.public_repos,
               bio = data.bio,
               displayName;

            if (name === null) {
               displayName = username;
            } else {
               displayName = name;
            }

            if (bio === null) {
               bio = 'Apparently the user wants to keep his bio private';
            }

            if (location === null) {
               location = 'Not specified';
            }

            $('#result').html(`
               <div class="card">
                 <div class="card-body">
                     <div class="row">
                        <div class="col-sm-12 col-lg-8 col-md-8">
                           <h4 class="card-title">` + displayName + `</h4>
                           <p class="card-text">Bio : ` + bio + `</p>
                           <p class="card-text">Lives in : ` + location + `</p>
                           <div class="row">
                              <div class="col-lg-4 col-md-4">
                                 <p class="card-text">Followers : ` + followers + `</p>
                              </div>
                              <div class="col-lg-4 col-md-4">
                                 <p class="card-text">Following : ` + following + `</p>
                              </div>
                              <div class="col-lg-4 col-md-4">
                                 <p class="card-text">Repositories : ` + repos + `</p>
                              </div>
                           </div>
                           <div class="mt-3">
                              <button class="btn btn-primary" onclick="location.href='` + html_url +  `';">View profile of ` + displayName + `</button>
                           </div>
                        </div>
                        <div class="col-sm-12 col-lg-4 col-md-4">
                           <img class="img-fluid" src=` + profilepic + ` />
                        </div>
                     </div>
                  </div>
               </div>
            `);

         },
         statusCode: {
            404: function () {
               $('#result').html(`
                  <div class="card">
                     <div class="card-body">
                        <h2>No Users Found</h2>
                     </div>
                  </div>
               `);
            }
         }
      });

   });

});
