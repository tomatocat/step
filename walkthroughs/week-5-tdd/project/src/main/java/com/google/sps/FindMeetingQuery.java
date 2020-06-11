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

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    // try brute force solution

    Collection<String> attendees = request.getAttendees();
    long duration = request.getDuration();

    // Initialize result time range (initially free the entire day)
    // TreeSet because we want the time ranges to be unique and sorted
    Collection<TimeRange> result = new TreeSet<>();
    result.add(TimeRange.WHOLE_DAY);

    // start with whole day and loop through events, subtracting times
    // Assume time ranges are not ordered
    for (Event event : events) {
      // We only care if even attendees overlap with the request
      if (hasOverlap(event, attendees)) {
        TimeRange time = event.getWhen();
      }
    }
    return result;
  }

  private boolean hasOverlap(Event event, Collection<String> other) {
    Set<String> eventAttendees = new HashSet<>(event.getAttendees());
    eventAttendees.retainAll(other);
    return !eventAttendees.isEmpty();
  }
}
