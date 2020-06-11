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

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    // try brute force solution

    Collection<String> attendees = request.getAttendees();
    long duration = request.getDuration();
    List<TimeRange> eventTimes = new ArrayList<>();

    // start with whole day and loop through events, subtracting times
    // Assume time ranges are not ordered
    for (Event event : events) {
      // We only care if even attendees overlap with the request
      if (hasOverlap(event, attendees)) {
        eventTimes.add(event.getWhen());
      }
    }

    eventTimes = invert(combine(eventTimes));
    // filter by duration (stream?) TODO
    return eventTimes;
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
   * @param times The list of times.
   * @return List of times, ordered and combined.
   */
  private List<TimeRange> combine(List<TimeRange> times) {

    // Perform null check
    if (times == null) {
      return null;
    }

    // Sort and initialize data structures
    times.sort(TimeRange.ORDER_BY_START);
    List<TimeRange> result = new ArrayList<>();
    TimeRange prevTime = times.get(0);
    int i = 1;

    while (i < times.size()) { // Something about overlaps
      TimeRange tmpTime = times.get(i);

      // Only do something if tmpTime is not completely engulfed by prevTime
      if (!prevTime.contains(tmpTime)) {
        if (prevTime.overlaps(tmpTime)) {
          // By sorting and the previous if statement, this overlap can only
          // occur in one way -- tmpTime starts & ends after prevTime.
          // Update prevTime to include tmpTime.
          prevTime = TimeRange.fromStartEnd(prevTime.start(), tmpTime.end(), false);
        } else {
          // Time ranges are completely disjoint.
          result.add(prevTime);
          prevTime = tmpTime;
        }
      }
      i++;
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
    int start = 0; // TODO
  }
}
