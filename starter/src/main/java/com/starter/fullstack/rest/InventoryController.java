package com.starter.fullstack.rest;

import com.starter.fullstack.api.Inventory;
import com.starter.fullstack.dao.InventoryDAO;
import java.util.List;
import javax.validation.Valid;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Inventory Controller.
 */
@RestController
@RequestMapping("/inventory")
public class InventoryController {
  private final InventoryDAO inventoryDAO;

  /**
   * Default Constructor.
   * @param inventoryDAO inventoryDAO.
   */
  public InventoryController(InventoryDAO inventoryDAO) {
    Assert.notNull(inventoryDAO, "Inventory DAO must not be null.");
    this.inventoryDAO = inventoryDAO;
  }

  /**
   * Find Inventories.
   * @return List of Inventories.
   */
  @GetMapping
  public List<Inventory> findInventories() {
    return this.inventoryDAO.findAll();
  }
  
  /**
   * Create Inventory.
   * @param inventory inventory
   * @return Inventory.
   */
  @PostMapping
  public Inventory create(@Valid @RequestBody Inventory inventory) {
    return this.inventoryDAO.create(inventory);
  }
  
  /**
   * Update Inventory.
   * @param inventory inventory
   * @return Inventory.
   */
  @PutMapping
  public Inventory update(@Valid @RequestBody Inventory inventory) {
    return this.inventoryDAO.update(inventory.getId(), inventory).orElse(null);
  }
  
  /**
   * Delete Inventory.
   * @param id Inventory id to delete.
   * @return Inventory.
   */
  @DeleteMapping
  public Inventory delete(@RequestBody String id) {
    return this.inventoryDAO.delete(id).orElse(null);
  }
}

