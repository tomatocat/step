// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.*;
import java.util.stream.Collectors;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    Collection<String> attendees = request.getAttendees();
    long duration = request.getDuration();
    List<TimeRange> eventTimes = new ArrayList<>();

    // Start with whole day and loop through events, subtracting times
    // Assume time ranges are not ordered
    for (Event event : events) {
      // We only care if even attendees overlap with the request
      if (hasOverlap(event, attendees)) {
        eventTimes.add(event.getWhen());
      }
    }

    // Combine all occupied times, then invert them to find all the free times
    eventTimes = invert(combine(eventTimes));

    // Filter event times to only include times that are long enough for the request
    return eventTimes.stream().filter(event -> event.duration() >= duration).collect(Collectors.toList());
  }

  /**
   * @param event Event to extract attendees from.
   * @param other Other collection of attendees to compare with.
   * @return Whether the event's attendees overlap with the other collection.
   */
  private boolean hasOverlap(Event event, Collection<String> other) {
    Set<String> eventAttendees = new HashSet<>(event.getAttendees());
    eventAttendees.retainAll(other);
    return !eventAttendees.isEmpty();
  }

  /**
   * Takes in unordered list of times and orders and combines them.
   * May return contiguous independent time ranges with no overlaps.
   * @param times The list of times.
   * @return List of times, ordered and combined.
   */
  private List<TimeRange> combine(List<TimeRange> times) {

    // Perform empty list check
    if (times == null || times.isEmpty()) {
      return new ArrayList<>();
    }

    // Sort and initialize data structures
    times.sort(TimeRange.ORDER_BY_START);
    List<TimeRange> result = new ArrayList<>();
    TimeRange prevTime = times.get(0);

    // Go through every time in events list to accumulate unavailable timeslots
    for (TimeRange time : times) {

      // Only do something if time is not completely engulfed by prevTime
      if (!prevTime.contains(time)) {
        if (prevTime.overlaps(time)) {
          // By sorting and the previous if statement, this overlap can only
          // occur in one way -- time starts & ends after prevTime.
          // Update prevTime to include time.
          prevTime = TimeRange.fromStartEnd(prevTime.start(), time.end(), false);
        } else {
          // Time ranges are completely disjoint.
          result.add(prevTime);
          prevTime = time;
        }
      }
    }

    result.add(prevTime);
    return result;
  }

  /**
   * Takes in ordered, non-overlapping list of times and returns the same,
   * but inverted through the day.
   * @param times List of times to parse.
   * @return List of times not included in the original list.
   */
  private List<TimeRange> invert(List<TimeRange> times) {
    int start= TimeRange.START_OF_DAY;
    List<TimeRange> result = new ArrayList<>();

    // For every occupied time range, the "free" time is the end of the previous
    // event plus the start of the current event.
    for (TimeRange time : times) {
      int end = time.start();
      result.add(TimeRange.fromStartEnd(start, end, false));
      start = time.end();
    }

    // Add in the remaining time at the end of the day, after the last event.
    result.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
    return result;
  }
}
