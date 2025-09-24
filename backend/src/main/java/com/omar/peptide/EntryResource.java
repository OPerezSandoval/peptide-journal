package com.omar.peptide;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/entries")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EntryResource {
  private static final Map<Long, Entry> STORE = new ConcurrentHashMap<>();
  private static final AtomicLong SEQ = new AtomicLong(1);
  public static record CreateEntry(String peptide, double dosageMg, String takenAt) {}

  @GET
  public Collection<Entry> list() {
    var all = new ArrayList<>(STORE.values());
    all.sort(Comparator.comparing(Entry::id).reversed());
    return all;
  }

  @POST
  public Entry create(CreateEntry req) {
    long id = SEQ.getAndIncrement();
    String when = (req.takenAt() == null || req.takenAt().isBlank())
      ? OffsetDateTime.now().toString()
      : req.takenAt();
    Entry e = new Entry(id, req.peptide(), req.dosageMg(), when);
    STORE.put(id, e);
    return e;
  }

  @DELETE @Path("/{id}")
  public void delete(@PathParam("id") long id) { STORE.remove(id); }
}
