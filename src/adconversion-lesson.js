function onLessonWork(user, itemID) {
    const markAsCompleteId = "mark-as-complete";
    const unmarkAsCompleteId = "unmark-as-complete";
    const completeId = "complete";
  
    const markAsFavoritedId = "mark-as-favorited";
    const unmarkAsFavoritedId = "mark-as-unfavorited";
  
    const completedLessonsData = JSON.parse(user.CompletedLessons || "[]");
    const favoritedLessonsData = JSON.parse(user.FavoritedLessons || "[]");
  
    const setCompletedStatus = function (lessonID, status = true) {
      const selectorQuery = `[data-lesson-id="${lessonID}"]`;
  
      const selector = document.querySelector(selectorQuery);
      if (selector) {
        console.log(selector);
        const videoIcon = selector.querySelector(`div[id="video-icon"]`);
        const checkIcon = selector.querySelector(`div[id="check-icon"]`);
        if (status) {
          videoIcon.style.display = "none";
          checkIcon.style.display = "inline-block";
        } else {
          checkIcon.style.display = "none";
          videoIcon.style.display = "inline-block";
        }
      }    
    };
    const setFavoritedStatus = function (lessonID, status = true) {
      const selectorQuery = `[data-lesson-id="${lessonID}"]`;
      console.log("[setFavoritedStatus]", selectorQuery);
  
      const selector = document.querySelector(selectorQuery);
      if (selector) {      
        const favoritesIcon = selector.querySelector(`.favorites-icon-stroke`);
        const unfavoritesIcon = selector.querySelector(`.favorites-icon-solid`);      
  
        if (status) {
          favoritesIcon.style.display = "none"; unfavoritesIcon.style.display = "inline-block";
        } else {
          favoritesIcon.style.display = "none"; unfavoritesIcon.style.display = "inline-block";
        }
      }
    };
  
    const boot = (completedLessonsData, favoritedLessonsdata) => {
      try {
        for (const lessonId of completedLessonsData) {
          setCompletedStatus(lessonId);
        }
  
        for (const lessonId of favoritedLessonsdata) {
          setFavoritedStatus(lessonId);
        }
        evaluateLessons(completedLessonsData);
      } catch (e) {
        console.log(e);
      }
    };
    boot(completedLessonsData, favoritedLessonsData);
  
    const setCompleteLesson = function (user) {
      try {
        console.log("[setComplete]", ...arguments);
        document.getElementById(markAsCompleteId).style.display = "none";
        document.getElementById(completeId).style.display = "inline-block";
        document.getElementById(unmarkAsCompleteId).style.display =
          "inline-block";
  
        /* Toggle Icons Aimar*/
        setCompletedStatus(itemID, true);
        
        const completedLessonsData = JSON.parse(user.CompletedLessons || "[]");
        evaluateLessons(completedLessonsData);
      } catch (ex) {   console.log(ex);  }
    };
  
    const unsetCompleteLesson = function (user) {
      try {      
        document.getElementById(markAsCompleteId).style.display = "inline-block";
        document.getElementById(completeId).style.display = "none";
        document.getElementById(unmarkAsCompleteId).style.display = "none";
  
        /* Toggle Icons - Aimar */
        setCompletedStatus(itemID, false);      
        const completedLessonsData = JSON.parse(user.CompletedLessons || "[]");
        evaluateLessons(completedLessonsData);
      } catch (ex) {
        console.log(ex);
      }
    };
    const setFavoritedLesson = function (user) {
      try {
        console.log("[setFavorite]", ...arguments);
        document.getElementById(markAsFavoritedId).style.display = "none";
        // document.getElementById(completeId).style.display = "inline-block";
        document.getElementById(unmarkAsFavoritedId).style.display = "inline-block";
  
        /* Toggle Icons Aimar*/
        setFavoritedStatus(itemID, true);
      } catch (ex) {
        console.log(ex);
      }
    };
    const unsetFavoritedLesson = function (user) {
      try {
        console.log("[unsetFavorite]", ...arguments);
        document.getElementById(markAsFavoritedId).style.display = "inline-block";
        document.getElementById(unmarkAsFavoritedId).style.display = "none";
  
        /* Toggle Icons - Aimar */
        setFavoritedStatus(itemID, false);
      } catch (ex) {
        console.log(ex);
      }
    };
  
    // If they have the item ID in their profile, hide the form, show the 'completed button'
    if (completedLessonsData.includes(itemID)) {
      setCompleteLesson(user);
    }
    if (favoritedLessonsData.includes(itemID)) {
      setFavoritedLesson(user);
    }
    async function onCompleteLesson() {    
        if (completedLessonsData.indexOf(itemID) === -1) {
          completedLessonsData.push(itemID);
          const result = await user.update({CompletedLessons: JSON.stringify(completedLessonsData)})
          setCompleteLesson(result);        
        }
    }
  
    // When the button is clicked, if the itemID doesn't exist on their profile add it, then update the user in Outseta.
    $("#" + markAsCompleteId).click(onCompleteLesson);
  
    $("#" + unmarkAsCompleteId).click(function () {
      var itemIndex = completedLessonsData.indexOf(itemID);
      if (itemIndex !== -1) {
        completedLessonsData.splice(itemIndex, 1);
        user.update({CompletedLessons: JSON.stringify(completedLessonsData)}).then(unsetCompleteLesson);
      }
    });
  
    $("#" + markAsFavoritedId).click(function () {    
      if (favoritedLessonsData.indexOf(itemID) === -1) {
        favoritedLessonsData.push(itemID);
        user.update({FavoritedLessons: JSON.stringify(favoritedLessonsData),}).then(setFavoritedLesson);
      }
    });
    $("#" + unmarkAsFavoritedId).click(function () {    
      var itemIndex = favoritedLessonsData.indexOf(itemID);
      if (itemIndex !== -1) {
        favoritedLessonsData.splice(itemIndex, 1);
        user.update({FavoritedLessons: JSON.stringify(favoritedLessonsData)}).then(unsetFavoritedLesson);
      }
    });
    function evaluateLessons(completedLessonsData) {
      // query selector
      function getCourseLessonsCount() {
        return (document.querySelector("div[data-course-count]")?.getAttribute("data-course-count") || 0);
      }
      function getCompletedLessonCount() {
        let ans = 0;
        for (const lss of completedLessonsData) {
          if (!!document.querySelector(`[data-lesson-id="${lss}"]`)) {
            ans++;
          }
        }
        return ans;
      }
  
      const scrollPorgressWrapper = document.querySelector(".scroll-porgress_wrapper");
  
      const courseCount = getCourseLessonsCount();
      const completedCount = getCompletedLessonCount();
      const compltedPercent = Math.round((completedCount / courseCount) * 100);
      
      if (!!scrollPorgressWrapper && courseCount > 0) {
        const lessonCompletedInfo = scrollPorgressWrapper.querySelector(".lesson-completed-info");
  
        if (lessonCompletedInfo) {
          lessonCompletedInfo.innerText = `${compltedPercent}% COMPLETE`;
        }
  
        const scrollProgressValue = scrollPorgressWrapper.querySelector(".scroll-progress_value");
        if (scrollProgressValue) {        
          scrollProgressValue.style.width = `${compltedPercent}%`;
        }
      }
    }
    // Variable to keep track of autoplay status
    let isAutoplayOn = false;
  
    // Function to execute when the toggle is on
    function functionOn() {    
      // Your code for when the toggle is ON
      var iframe = document.querySelector('#lesson-video');
      var player = new Vimeo.Player(iframe);
  
      async function redirectAfterVideoEnds() {      
        if (isAutoplayOn) {
            await onCompleteLesson();
          window.location.href = 'executing-your-campaign-plan';
        }
      }
      // Remove the event listener first to avoid multiple executions
      player.off('ended', redirectAfterVideoEnds);
      // Add the event listener back to execute once
      player.on('ended', redirectAfterVideoEnds);
      // Play the video
      player.play();
    }
  
    // Function to execute when the toggle is off
    function functionOff() {  
      // Your code for when the toggle is OFF
      var iframe = document.querySelector('#lesson-video');
      var player = new Vimeo.Player(iframe);
      // Remove the event listener to prevent redirection
      player.off('ended', redirectAfterVideoEnds);
    }
    document.querySelector('#autoplayToggle').addEventListener('click', handleToggleChange)
    // Function to handle the toggle change event
    function handleToggleChange() {
      const autoplayToggle = document.getElementById("autoplayToggle");
      const toggleValue = autoplayToggle.checked; // true if toggle is ON, false if it's OFF    
      // Store the toggle value in local storage
      localStorage.setItem("autoplayToggleValue", toggleValue);
      // Update the autoplay status
      isAutoplayOn = toggleValue;
      // Execute the corresponding function based on the toggle value
      if (toggleValue) functionOn();
      else functionOff();    
    }
  
    // Check if the toggle value is already stored in local storage
    const storedToggleValue = localStorage.getItem("autoplayToggleValue");
    // If it's stored, set the toggle's state accordingly and execute the corresponding function
    if (storedToggleValue !== null) {
      document.getElementById("autoplayToggle").checked = JSON.parse(storedToggleValue);
      handleToggleChange();
    }  
     // search function 
    function onFilteringCourseLessons(type) {
      function updateItemsVisiblity(items, candidates, checkFunction = (item, list) => !list.includes(item)) {
        for(const item of items) {
          const lessonID = item.querySelector('[data-lesson-id]').getAttribute('data-lesson-id')
          if(checkFunction(lessonID, candidates)) {
            item.style.display = 'none';
          }
        }
      }
      const items =  Array.from(document.querySelectorAll('.lessons_collection-item'))                
      items.map(item=>item.style.display='block')
      if(type == 'favorite') updateItemsVisiblity(items, favoritedLessonsData)
      else if(type == 'completed') updateItemsVisiblity(items, completedLessonsData)
      else if(type == 'incompleted') updateItemsVisiblity(items, completedLessonsData, (item, list) => list.includes(item))                
    }
    document.querySelector('#course-filter-all').addEventListener('change', () => onFilteringCourseLessons('all'))
    document.querySelector('#course-filter-favorite').addEventListener('change', () => onFilteringCourseLessons('favorite'))
    document.querySelector('#course-filter-completed').addEventListener('change', () => onFilteringCourseLessons('completed'))
    document.querySelector('#course-filter-in-completed').addEventListener('change', () => onFilteringCourseLessons('incompleted'))   

}
window.onLessonWork = onLessonWork