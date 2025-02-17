package com.starter.fullstack.dao;

import com.starter.fullstack.api.Inventory;
import com.starter.fullstack.config.EmbedMongoClientOverrideConfig;
import java.util.List;
import java.util.Optional;
import javax.annotation.Resource;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Test Inventory DAO.
 */
@ContextConfiguration(classes = {EmbedMongoClientOverrideConfig.class})
@DataMongoTest
@RunWith(SpringRunner.class)
public class InventoryDAOTest {
  @Resource
  private MongoTemplate mongoTemplate;
  private InventoryDAO inventoryDAO;
  private static final String NAME = "Amber";
  private static final String PRODUCT_TYPE = "hops";
  private static final String ID = "testID";

  @Before
  public void setup() {
    this.inventoryDAO = new InventoryDAO(this.mongoTemplate);
  }

  @After
  public void tearDown() {
    this.mongoTemplate.dropCollection(Inventory.class);
  }

  /**
   * Test Find All method.
   */
  @Test
  public void findAll() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    this.mongoTemplate.save(inventory);
    List<Inventory> actualInventory = this.inventoryDAO.findAll();
    
    Assert.assertFalse(actualInventory.isEmpty());
  }
  
  /**
   * Test Create method 
   */
  @Test
  public void create() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    inventory.setId(ID);
    Inventory actualInventoryItem = this.inventoryDAO.create(inventory);
    
    Assert.assertNotNull(actualInventoryItem);
    Assert.assertEquals(inventory.getName(), actualInventoryItem.getName());
    Assert.assertEquals(inventory.getProductType(), actualInventoryItem.getProductType());
    Assert.assertNotEquals(actualInventoryItem.getId(), ID);
  }
  
  /**
   * Test Delete method where the inventory to be deleted exists
   */
  @Test
  public void deleteInventoryExists() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    Inventory createdInventory = this.inventoryDAO.create(inventory);
    
    Assert.assertEquals(1, this.inventoryDAO.findAll().size());
    
    Optional<Inventory> deletedInventory = this.inventoryDAO.delete(createdInventory.getId());
    
    Assert.assertTrue(deletedInventory.isPresent());
    Assert.assertEquals(0, this.inventoryDAO.findAll().size());
  }
  
  /**
   * Test Delete method where the inventory with the ID to be deleted does not exist
   */
  @Test
  public void deleteInventoryNotExist() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    this.inventoryDAO.create(inventory);
    Optional<Inventory> deletedInventory = this.inventoryDAO.delete(ID);
    
    Assert.assertFalse(deletedInventory.isPresent());
    Assert.assertEquals(1, this.inventoryDAO.findAll().size());
  }
  
  /**
   * Test Retrieve method where the inventory with the ID to be retrieved exists
   */
  @Test
  public void retrieveInventoryExists() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    Inventory createdInventory = this.inventoryDAO.create(inventory);
    
    Optional<Inventory> retrievedInventory = this.inventoryDAO.retrieve(createdInventory.getId());
    
    Assert.assertTrue(retrievedInventory.isPresent());
  }
  
  /**
   * Test Retrieve method where the inventory with the ID to be retrieved does not exist
   */
  @Test
  public void retrieveInventoryNotExist() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    Inventory createdInventory = this.inventoryDAO.create(inventory);
    
    Optional<Inventory> retrievedInventory = this.inventoryDAO.retrieve("FakeID");
    
    Assert.assertFalse(retrievedInventory.isPresent());
  }
  
  /**
   * Test Update method where the inventory with the ID to be updated exists
   * Depends on Retrieve method
   */
  @Test
  public void updateInventoryExists() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    Inventory createdInventory = this.inventoryDAO.create(inventory);
    
    createdInventory.setName("New Name");
    Optional<Inventory> updatedInventory = this.inventoryDAO.update(createdInventory.getId(), createdInventory);
    
    Assert.assertTrue(updatedInventory.isPresent());
    Assert.assertEquals(createdInventory.getName(), updatedInventory.get().getName());
  }
  
  /**
   * Test Update method where the inventory with the ID to be updated does not exist
   * Depends on Retrieve method
   */
  @Test
  public void updateInventoryNotExist() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    Inventory createdInventory = this.inventoryDAO.create(inventory);
    
    createdInventory.setName("New Name");
    Optional<Inventory> updatedInventory = this.inventoryDAO.update("fakeID!", createdInventory);
    
    Assert.assertFalse(updatedInventory.isPresent());
  }
  
}
